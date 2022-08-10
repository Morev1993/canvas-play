export function drawText(ctx, text, x, y, color) {
  ctx.fillStyle = color;
  ctx.font = "14px arial serif";

  ctx.fillText(text, x, y);
}
