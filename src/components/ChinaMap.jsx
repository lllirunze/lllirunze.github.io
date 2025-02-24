import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";

export default function ChinaMap() {
  const svgRef = useRef(null);
  const [provinces, setprovinces] = useState({}); // 存储从 JSON 读取的数据

  useEffect(() => {
    // **读取 provinces.json**
    fetch("/data/provinces.json")
      .then(res => res.json())
      .then(data => setprovinces(data))
      .catch(err => console.error("加载 provinces 失败", err));
  }, []);

  useEffect(() => {
    if (Object.keys(provinces).length === 0) return; // 避免 JSON 未加载时执行

    fetch("/map/china.geo.json")
      .then(res => res.json())
      .then(topoData => {
        const chinaGeoJSON = feature(topoData, topoData.objects.default);

        const width = 250, height = 180;

        const projection = d3.geoMercator()
          .center([105, 37])
          .scale(215)
          .translate([width / 2, height / 2]);

        const pathGenerator = d3.geoPath().projection(projection);

        const svg = d3.select(svgRef.current)
          .attr("width", width)
          .attr("height", height);

        // **获取最大停留天数**
        const maxDays = d3.max(Object.values(provinces)) || 30;

        // **颜色比例尺（白色 → 绿色）**
        const colorScale = d3.scaleLinear()
          .domain([1, maxDays])
          .range(["#ffffff", "#006400"])
          .interpolate(d3.interpolateHcl);

        // **创建 tooltip**
        const tooltip = d3.select("body")
          .append("div")
          .style("position", "absolute")
          .style("background", "rgba(0, 0, 0, 0.7)")
          .style("color", "white")
          .style("padding", "5px 10px")
          .style("border-radius", "8px")
          .style("font-size", "12px")
          .style("opacity", 0)
          .style("pointer-events", "none")
          .style("z-index", "9999"); // **让 tooltip 始终处于最上层**

        // **绘制地图**
        svg.selectAll("path")
          .data(chinaGeoJSON.features)
          .join("path")
          .attr("d", pathGenerator)
          .attr("fill", d => {
            const days = provinces[d.properties.name] || 0;
            return days === 0 ? "#ffffff" : colorScale(days);
          })
          .attr("stroke", "#000")
          .attr("stroke-width", 0.5)
          .on("mouseover", function (event, d) {
            d3.select(this).attr("fill", "orange"); // 省份变色

            tooltip.transition().duration(200)
              .style("opacity", 1)
              .text(`${d.properties.name}`);
          })
          .on("mousemove", function (event) {
            tooltip.style("top", (event.pageY - 25) + "px") // **防止鼠标挡住 tooltip**
              .style("left", (event.pageX + 5) + "px")
              .style("z-index", "9999"); // **确保 tooltip 永远在最上层**
          })
          .on("mouseout", function (event, d) {
            const days = provinces[d.properties.name] || 0;
            d3.select(this).attr("fill", days === 0 ? "#ffffff" : colorScale(days));

            tooltip.transition().duration(200)
              .style("opacity", 0);
          });

      })
      .catch(err => console.error("加载地图失败", err));
  }, [provinces]); // 当 provinces 加载完成后才执行

  return <svg ref={svgRef}></svg>;
}
