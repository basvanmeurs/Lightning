import Stage from "../tree/Stage";
import CoreContext from "../tree/core/CoreContext";
import Shader from "../tree/Shader";
import { Constructor } from "../util/types";
import { TextureSourceOptions } from "../tree/Texture";
import { RenderTexture } from "./webgl/WebGLRenderer";
import TextureSource from "../tree/TextureSource";
import NativeTexture from "./NativeTexture";

export default abstract class Renderer {
    _defaultShader?: Shader;

    protected constructor(public stage: Stage) {}

    gc(aggressive: boolean) {}

    abstract destroy(): void;

    getDefaultShader(ctx = this.stage.context) {
        if (!this._defaultShader) {
            this._defaultShader = this._createDefaultShader(ctx);
        }
        return this._defaultShader;
    }

    protected abstract _createDefaultShader(ctx: CoreContext): Shader;

    isValidShaderType(shaderType: Constructor<Shader>) {
        return shaderType.prototype instanceof this._getShaderBaseType();
    }

    getSupportedShaderType(shaderType: Constructor<Shader>) {
        if (!this.isValidShaderType(shaderType)) {
            const convertedShaderType = this._getShaderAlternative(shaderType);
            if (!convertedShaderType) {
                return undefined;
            }
            return convertedShaderType;
        } else {
            return shaderType;
        }
    }

    abstract _getShaderBaseType(): Constructor<Shader>;

    protected _getShaderAlternative(shaderType: Constructor<Shader>): Constructor<Shader> | undefined {
        return undefined;
    }

    copyRenderTexture(
        renderTexture: RenderTexture,
        nativeTexture: WebGLTexture,
        options: {
            sx?: number;
            sy?: number;
            x?: number;
            y?: number;
            w?: number;
            h?: number;
        }
    ) {
        console.warn("copyRenderTexture not supported by renderer");
    }

    abstract freeTextureSource(textureSource: TextureSource): void;

    abstract uploadTextureSource(textureSource: TextureSource, options: TextureSourceOptions): NativeTexture;
}
