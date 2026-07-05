import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";

export default function ChinaMap() {
  const svgRef = useRef(null);
  const [provinces, setProvinces] = useState({});
  const [chinaGeoJSON, setChinaGeoJSON] = useState(null);
  const [themeVersion, setThemeVersion] = useState(0);

  useEffect(() => {
    fetch("/data/provinces.json")
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(err => console.error("加载 provinces 失败", err));

    fetch("/map/china.geo.json")
      .then(res => res.json())
      .then(topoData => setChinaGeoJSON(feature(topoData, topoData.objects.default)))
      .catch(err => console.error("加载地图失败", err));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setThemeVersion(version => version + 1);
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (Object.keys(provinces).length === 0 || !chinaGeoJSON) return;

    const width = 430, height = 278;
    const rootStyles = getComputedStyle(document.documentElement);
    const isDark = document.documentElement.classList.contains("dark");
    const hue = Number(rootStyles.getPropertyValue("--hue").trim() || 175);
    const primaryColor = rootStyles.getPropertyValue("--primary").trim() || `oklch(0.75 0.14 ${hue})`;
    const emptyFill = isDark ? "rgba(255, 255, 255, 0.08)" : "#ffffff";
    const strokeColor = isDark ? "rgba(255, 255, 255, 0.34)" : "rgba(0, 0, 0, 0.32)";

    const projection = d3.geoMercator()
      .center([105, 37])
      .scale(288)
      .translate([width / 2 - 28, height / 2 - 10]);

    const pathGenerator = d3.geoPath().projection(projection);

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("display", "block")
      .style("margin", "0 auto");

    svg.selectAll("*").remove();

    const maxDays = d3.max(Object.values(provinces)) || 30;
    const colorScale = d3.scaleLinear()
      .domain([1, maxDays])
      .range([
        d3.hcl(hue, isDark ? 20 : 12, isDark ? 30 : 97),
        d3.hcl(hue, isDark ? 52 : 42, isDark ? 72 : 58),
      ])
      .interpolate(d3.interpolateHcl);

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
      .style("z-index", "9999");

    svg.selectAll("path")
      .data(chinaGeoJSON.features)
      .join("path")
      .attr("d", pathGenerator)
      .attr("fill", d => {
        const days = provinces[d.properties.name] || 0;
        return days === 0 ? emptyFill : colorScale(days);
      })
      .attr("stroke", strokeColor)
      .attr("stroke-width", 0.8)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", primaryColor);

        tooltip.transition().duration(200)
          .style("opacity", 1)
          .text(`${d.properties.name}`);
      })
      .on("mousemove", function (event) {
        tooltip.style("top", `${event.pageY - 25}px`)
          .style("left", `${event.pageX + 5}px`)
          .style("z-index", "9999");
      })
      .on("mouseout", function (event, d) {
        const days = provinces[d.properties.name] || 0;
        d3.select(this).attr("fill", days === 0 ? emptyFill : colorScale(days));

        tooltip.transition().duration(200)
          .style("opacity", 0);
      });

    return () => {
      tooltip.remove();
    };
  }, [chinaGeoJSON, provinces, themeVersion]);

  return <svg ref={svgRef} aria-label="China travel footprint map"></svg>;
}
