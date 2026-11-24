# 新增菜谱

每道菜添加一份 `slug.yaml`，图片放在
`src/assets/images/recipes/slug/`。文件名 slug 只用小写英文字母、数字和中间连字符。
发布后网址为 `/recipes/slug/`。

分类目前可选：家常、荤菜、素菜、主食、汤羹、甜点、饮品。
如需新分类，修改 `src/utils/recipes/schema.ts` 中的 `recipeCategories`。

```yaml
schemaVersion: 1
recipe:
  title: 番茄炒蛋
  subtitle: Stir-fried tomato and scrambled eggs
  category: 家常
  servings: 2
  prepMinutes: 5
  cookMinutes: 10
presentation:
  template: portrait
  variant: image-left
  cover:
    file: cover.webp
    alt: 陶盘里的番茄炒蛋
ingredients:
  - id: tomato
    name: 番茄
    amount: 2
    unit: 个
  - id: egg
    name: 鸡蛋
    amount: 3
    unit: 个
steps:
  - text: 番茄洗净切块，鸡蛋打散。
    uses: [tomato, egg]
  - text: 炒熟鸡蛋，加入番茄炒至软烂后出锅。
    uses: [tomato, egg]
publication:
  status: draft
  featured: false
```

发布时将 `status` 改为 `published`，并填写未被使用的正整数 `order`
（建议 10、20、30）。`duet` 还须填写四种 `variant` 之一及 `detail` 图片。
图片、食材引用或排序有误时，构建会报错。

## 照片裁剪

保留原始照片，无需预裁剪。详情页主图统一以 4:5、次图以 4:3
从几何中心展示最大可用区域；横图、竖图和方图都可以使用。
目录卡片沿用原有的 4:3 比例，首页首张大图为 16:9。
建议主图尽量接近 1200 × 1500，次图尽量接近 1200 × 900，
并把菜品主体放在画面中心附近。

`cover` 和 `detail` 只填写 `file`、`alt`，需要时可填写 `caption`。
`focalPoint`、裁剪坐标、缩放倍率和自定义图片比例均不支持。
