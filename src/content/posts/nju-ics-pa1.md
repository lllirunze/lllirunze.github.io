---
title: NJU ICS PA1
published: 2025-01-30
description: '南京大学计算机科学与技术系计算机系统基础课程实验-PA1'
image: '../../assets/images/posts/nju-ics/Snipaste_2025-02-08_23-15-33.png'
tags: ['nju-ics']
category: 'Project'
draft: false 
lang: ''
---

### 选择实现架构：`riscv32`

## 单步执行

```c
// nemu\src\monitor\sdb\sdb.c
static int cmd_si(char *args) {
  char *str = strtok(args, " ");
  if (str == NULL) cpu_exec(1);
  else {
    uint64_t step = strtoul(str, NULL, 10);
    cpu_exec(step);
  }
  return 0;
}
```

## 打印寄存器

```c
// nemu\src\monitor\sdb\sdb.c
static int cmd_info(char *args) {
  isa_reg_display();
  return 0;
}
```

```c
// nemu\src\isa\riscv32\reg.c
void isa_reg_display() {
  int reg_num = ARRLEN(cpu.gpr);
  int i;
  for (i = 0; i < reg_num; i++) {
    printf("%s\t0x%08x\t%u\n", reg_name(i), gpr(i), gpr(i));
  }
  printf("pc\t0x%08x\t%u\n", cpu.pc, cpu.pc);
}
```

## 扫描内存

先实现一个简单的版本：规定表达式`expr`中只能是一个十六进制数

```c
// nemu\src\monitor\sdb\sdb.c
static int cmd_x(char *args) {
  char *str = strtok(NULL, " ");
  int N = atoi(str);
  char *expr = strtok(NULL, " ");
  expr = expr + 2;
  vaddr_t src = (vaddr_t)strtoul(expr, NULL, 16);

  int i;
  for (i = 0; i < N; i++) {
    word_t addr = vaddr_read(src + i * 4, 4);
    if (i % 4 == 0) printf("0x%08x:\t", src + i * 4);
    printf("0x%08x", addr);
    if (i % 4 == 3) printf("\n");
    else printf("\t");
  }
  if (N % 4 != 0) printf("\n");

  return 0;
}
```

## 算术表达式的词法分析

我们在实现的过程中需要注意一件事情，运算符是存在计算优先级的，可以参考[link](https://blog.csdn.net/sunshihua12829/article/details/47912123)。我们调整`struct rule`类型的结构，添加一个变量priority。

```c
// nemu\src\monitor\sdb\expr.c
struct rule {
  const char *regex;
  int token_type;
  int priority;
};
```

我们根据正则表达式对token类型添加匹配规则：

```c
// nemu\src\monitor\sdb\expr.c
static struct rule rules[] = {
  {" +", TK_NOTYPE, 0},             // spaces
  {"\\+", '+', 4},                  // plus
  {"-", '-', 4},                    // minus OR negation
  {"\\*", '*', 3},                  // multiplication OR dereference
  {"\\/", '/', 3},                  // division
  {"\\%", '%', 3},                  // mod
  {"\\(", '(', 1},                  // left parenthesis
  {"\\)", ')', 1},                  // right parenthesis
  {"0[xX][0-9a-fA-F]+", TK_HEX, 0}, // hexadecimal number -> 0x..(0)
  {"[0-9]+", TK_DEC, 0},            // decimal number
  {"\\$(0|ra|sp|gp|tp|t[0-6]|s10|s11|s[0-9]|a[0-7]|pc)", TK_REG, 0}, // registers
  {"==", TK_EQ, 7},                 // equal
  {"!=", TK_NEQ, 7},                // not equal
  {"&&", TK_AND, 11},               // and
  {"\\|\\|", TK_OR, 12},            // or
  {"!", '!', 2},                    // not
  {"&", '&', 8},                    // bitwise and (we don't consider taking address)
  {"\\|", '|', 10},                 // bitwise or
  {"\\^", '^', 9},                  // bitwise xor
  {"~", '~', 2},                    // bitwise inversion
  {"<<", TK_SHIFTLEFT, 5},          // shift left
  {">>", TK_SHIFTRIGHT, 5},         // shift right
  {">=", TK_GEQ, 6},                // greater than or equal to
  {"<=", TK_LEQ, 6},                // less than or equal to
  {">", TK_G, 6},                   // greater than
  {"<", TK_L, 6},                   // less than
};
```

然后我们在制定好规则之后，通过`make_token()`来识别并记录token。

```c
// nemu\src\monitor\sdb\expr.c
static bool make_token(char *e) {
  int position = 0;
  int i;
  regmatch_t pmatch;
  nr_token = 0;
  while (e[position] != '\0') {
    for (i = 0; i < NR_REGEX; i ++) {
      if (regexec(&re[i], e + position, 1, &pmatch, 0) == 0 && pmatch.rm_so == 0) {
        char *substr_start = e + position;
        int substr_len = pmatch.rm_eo;
        position += substr_len;

        if (substr_len > 32) return false;
        if (nr_token >= NR_TOKENS) return false;

        switch (rules[i].token_type) {
          case TK_NOTYPE: break;
          case ... :
            tokens[nr_token].type = rules[i].token_type;
            strncpy(tokens[nr_token].str, substr_start, substr_len);
            tokens[nr_token].priority = rules[i].priority;
            nr_token++;
            break;
          default: break;
        }
        break;
      }
    }
    if (i == NR_REGEX) return false;
  }
  return true;
}
```

## 算术表达式的递归求值

得到对应的tokens数组之后，我们就可以根据它们来进行递归求值，整体逻辑如下：

```c
// nemu\src\monitor\sdb\expr.c
word_t eval(int left, int right, bool *success) {
  if (left > right) /* bad expression */
  else if (left == right) /* return value */
  else if (check_parentheses(left, right) == true) return eval(left+1, right-1, success);
  else {
    /* find dominate operator */
    word_t val1 = eval(left, op-1, success);
    word_t val2 = eval(op+1, right, success);
    switch(op_type) {
      case ... : /* perform calculations */
      default: /* bad expression */
    }
  }
  return 0;
}
```

这里有一些子函数需要进行编写。首先是判断两边括号是否能够匹配，如果匹配就计算`eval(left+1, right-1, success)`，否则进行后续常规计算。

```c
// nemu\src\monitor\sdb\expr.c
bool check_parentheses(int left, int right) {
  if (tokens[left].type != '(' || tokens[right].type != ')') return false;
  int layer = 0;
  int i;
  for (i = left; i < right; i++) {
    if (tokens[i].type == '(') layer++;
    else if (tokens[i].type == ')') layer--;
    if (layer <= 0) return false;
  }
  return (layer == 1);
}
```

另外一个是需要找到计算式中的主运算符。这里需要注意几点：

- 不同类型的运算符的结合方向是不同的。例如加号`+`的运算方向是从左到右，而逻辑非`!`的运算方向是从右到左。
- 括号内的运算符先排除在外，暂时不能作为主运算符，例如`1+(2*3)`和`(1+2)*3`的主运算符是不同的。

因此我们可以编写如下代码：

```c
// nemu\src\monitor\sdb\expr.c
int check_priority(int left, int right) {
  int dominate_priority = 0;
  int i;
  int layer = 0;
  for (i = left; i <= right; i++) {
    if (tokens[i].type == '(') layer++;
    else if (tokens[i].type == ')') layer--;
    if (layer != 0) continue;
    if (tokens[i].priority > dominate_priority) dominate_priority = tokens[i].priority;
  }
  return dominate_priority;
}

int find_dominate_operator(int left, int right, int pri, bool leftToRight) {
  int i;
  int layer = 0;
  if (leftToRight == false) {
    for (i = left; i <= right; i++) {
      if (tokens[i].type == '(') layer++;
      else if (tokens[i].type == ')') layer--;
      if (layer != 0) continue;
      if (tokens[i].priority == pri) return i;
    }
  }
  else {
    for (i = right; i >= left; i--) /* same steps */
  }
  return 0;
}

word_t eval(int left, int right, bool *success) {
  if (left > right) { }
  else if (left == right) { }
  else if (check_parentheses(left, right) == true) { }
  else {
    int dominate_priority = check_priority(left, right);
    bool leftToRight;
    if (dominate_priority == 2 || dominate_priority == 13 || dominate_priority == 14) leftToRight = false;
    else leftToRight = true;
    int op = find_dominate_operator(left, right, dominate_priority, leftToRight);
    int op_type = tokens[op].type;    
    switch(op_type) { /* perform calculations */ }
  }
  return 0;
}
```

具体的代码请移步至[代码仓](https://github.com/lllirunze/nju-ics-pa/blob/master/nemu/src/monitor/sdb/expr.c)。

## 实现带有负数的算术表达式

当识别出减号的时候，我们需要判断这个符号是减号还是负号，总共有这几种条件，只要满足一条，就可以是负号。

- `-`是第一个token
- `-`的前一个token不是数字、寄存器或者`)`

```c
// nemu\src\monitor\sdb\expr.c
case '-':
  if (nr_token != 0 && (tokens[nr_token-1].type == TK_DEC || tokens[nr_token-1].type == TK_HEX || tokens[nr_token-1].type == TK_REG || tokens[nr_token-1].type == ')')) {
    tokens[nr_token].type = '-';
    tokens[nr_token].priority = 4;
  }
  else {
    tokens[nr_token].type = TK_NEG;
    tokens[nr_token].priority = 2;
  }
  strncpy(tokens[nr_token].str, substr_start, substr_len);
  nr_token++;
  break;
```

负号是一个单目运算符，因此我们写下`case TK_NEG: return -eval(op+1, right, success);`就可以了。

## 除0的确切行为

```c
// nemu\src\monitor\sdb\expr.c
switch(op_type) {
  case '/':
    val1 = eval(left, op-1, success);
    val2 = eval(op+1, right, success);
    if (val2 == 0) {
      Log("Warning: The divisor cannot be 0.");
      *success = false;
      return 0;
    }
    return val1 / val2;
}
```

## 表达式生成器

```c
// nemu\tools\gen-expr\gen-expr.c
static inline void gen(char e) {
  int i = 0;
  while (buf[i] != '\0') i++;
  buf[i] = e;
  buf[i+1] = '\0';
  return;
}

static inline void gen_num() {
  uint32_t num = ((uint32_t) rand()) % 100;
  sprintf(buf+strlen(buf), "%d", num);
  return;
}

static inline void gen_op() {
  switch(rand() % 4) {
    case 0: gen('+'); break;
    case 1: gen('-'); break;
    case 2: gen('*'); break;
    case 3: gen('/'); break;
    default: break;
  }
}

static void gen_rand_expr() {
  char *s = buf;
  if (strlen(buf) > 0 && *(buf+strlen(buf)-1) == '/') s = buf+strlen(buf);
  int n = rand() % 3;
  switch(n) {
    case 0:  gen_num();                                  break;
    case 1:  gen('('); gen_rand_expr(); gen(')');        break;
    default: gen_rand_expr(); gen_op(); gen_rand_expr(); break;
  }

  // test division 0
  if (s != buf) {
    sprintf(code_buf, code_format, s);
    FILE *fp = fopen("/tmp/.code.c", "w");
    assert(fp != NULL);
    fputs(code_buf, fp);
    fclose(fp);

    int ret = system("gcc /tmp/.code.c -o /tmp/.expr");
    if(ret != 0) printf("ret: %d\n",ret);
		
    fp = popen("/tmp/.expr", "r");
    int result;
    fscanf(fp, "%d", &result);
    pclose(fp);

    if(result == 0){
      memset((void*)s, 0, strlen(s) * sizeof(char));
      gen_rand_expr();
    }
  }
}
```

在`nemu\tools\gen-expr`下运行`make run`，即可进行随机测试。

## 扩展表达式求值的功能

该内容已经实现，详见前文。

## 监视点池的管理

```c
// nemu\src\monitor\sdb\watchpoint.c
typedef struct watchpoint {
  int NO;
  struct watchpoint *next;
  char expression[1024];
  word_t old_val;
} WP;

static WP *new_wp() {
  if (free_ == NULL) return NULL;
  WP *wp = free_;
  free_ = free_->next;
  return wp;
}

static void free_wp(WP *wp) {
  wp->next = free_;
  wp->old_val = 0;
  memset(wp->expression, 0, sizeof(wp->expression));
  free_ = wp;
  return;
}
```

## 实现监视点

我们在`nemu/Kconfig`中添加一个开关选项，这样在`make menuconfig`时可以选择是否进行difftest。

```
// nemu\Kconfig
menu "Testing and Debugging"

...

config WATCHPOINT
  bool "Enable watchpoints scanning"
  default n
```

在menuconfig中勾选监视点扫描后，我们就可以使用`CONFIG_WATCHPOINT`参数扫描观察点了。

```c
// nemu\src\cpu\cpu-exec.c
static void trace_and_difftest(Decode *_this, vaddr_t dnpc) {
#ifdef CONFIG_WATCHPOINT
  if (scan_wp(_this->pc)) { nemu_state.state = NEMU_STOP; }
#endif
}
```

```c
// nemu\src\monitor\sdb\watchpoint.c
bool scan_wp(vaddr_t pc) {
  bool success;
  WP *cur = head;
  while (cur != NULL) {
    success = true;
    word_t new_val = expr(cur->expression, &success);
    if (cur->old_val != new_val) return true;
    cur->old_val = new_val;
    cur = cur->next;
  }
  return false;
}
```

```c
// nemu\src\monitor\sdb\watchpoint.c
bool scan_wp(vaddr_t pc) {
  bool success;
  WP *cur = head;
  while (cur != NULL) {
    success = true;
    word_t new_val = expr(cur->expression, &success);
    if (cur->old_val != new_val) return true;
    cur->old_val = new_val;
    cur = cur->next;
  }
  return false;
}
```

---

:::note[Reference]
- [C99 standard](https://www.dii.uchile.cl/~daespino/files/Iso_C_1999_definition.pdf)
- [C语言运算符优先级表](https://blog.csdn.net/sunshihua12829/article/details/47912123)
:::
