import { BitmapLayer } from "@deck.gl/layers/typed";

class ColorRemapBitmapLayer extends BitmapLayer<{
  colorRange: [Array<number>, Array<number>];
}> {
  getShaders() {
    return {
      ...super.getShaders(),
      inject: {
        "fs:#decl": `
        uniform vec4 fromColor;
        uniform vec4 toColor;`,
        "fs:DECKGL_FILTER_COLOR": `
        float grayscale = (color.r + color.g + color.b) / 3.0;
        color = mix(fromColor, toColor, grayscale);`,
      },
    };
  }

  draw(opts: any) {
    const colorRange = this.props.colorRange;
    if (colorRange && colorRange.length) {
      opts.uniforms.fromColor = colorRange[0].map((x) => x / 255);
      opts.uniforms.toColor = colorRange[1].map((x) => x / 255);
    }

    super.draw(opts);
  }
  render() {
    return (
      <div
        style={{
          position: "absolute",
          zIndex: 1000,
          width: "200px",
          backgroundColor: "#fff",
        }}
      >
        hello
      </div>
    );
  }
}
export default ColorRemapBitmapLayer;
