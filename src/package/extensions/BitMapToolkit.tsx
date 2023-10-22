import { LayerExtension } from "@deck.gl/core/typed";

export default class BitMapToolkit extends LayerExtension {
  getShaders() {
    return {
      inject: {
        // Declare custom uniform
        "fs:#decl": "uniform bool highlightRed;",
        // Standard injection hook - see "Writing Shaders"
        "fs:DECKGL_FILTER_COLOR": `
              if (highlightRed) {
                if (color.r / max(color.g, 0.001) > 2. && color.r / max(color.b, 0.001) > 2.) {
                  // is red
                  color = vec4(1.0, 0.0, 0.0, 1.0);
                } else {
                  discard;
                }
              }
            `,
      },
    };
  }

  updateState(params: any) {
    const { highlightRed = true } = params.props;
    //@ts-expect-error
    for (const model of this.getModels()) {
      model.setUniforms({ highlightRed });
    }
  }

  getSubLayerProps() {
    //@ts-expect-error
    const { highlightRed = true } = params.props;
    return {
      highlightRed,
    };
  }
}
