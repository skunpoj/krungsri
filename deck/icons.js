const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa6");

async function png(Icon, color, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Icon, { color, size: String(size) })
  );
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

async function buildIcons(P) {
  return {
    keyboard:  await png(fa.FaKeyboard, "#FFFFFF"),
    check:     await png(fa.FaCircleCheck, "#" + P.green),
    checkW:    await png(fa.FaCircleCheck, "#FFFFFF"),
    bulb:      await png(fa.FaLightbulb, "#" + P.amber),
    warn:      await png(fa.FaTriangleExclamation, "#" + P.amber),
    invoice:   (c) => png(fa.FaFileInvoiceDollar, "#" + c),
    box:       (c) => png(fa.FaBoxOpen, "#" + c),
    contract:  (c) => png(fa.FaFileContract, "#" + c),
    file:      (c) => png(fa.FaFileLines, "#" + c),
    arrow:     (c) => png(fa.FaArrowRightLong, "#" + c),
    globe:     (c) => png(fa.FaEarthAsia, "#" + c),
    industry:  (c) => png(fa.FaIndustry, "#" + c),
    leaf:      (c) => png(fa.FaSeedling, "#" + c),
    shirt:     (c) => png(fa.FaShirt, "#" + c),
    chip:      (c) => png(fa.FaMicrochip, "#" + c),
    scale:     (c) => png(fa.FaScaleBalanced, "#" + c),
    magnify:   (c) => png(fa.FaMagnifyingGlass, "#" + c),
    rocket:    (c) => png(fa.FaRocket, "#" + c),
    xmark:     (c) => png(fa.FaCircleXmark, "#" + c),
  };
}

module.exports = { buildIcons, png };
