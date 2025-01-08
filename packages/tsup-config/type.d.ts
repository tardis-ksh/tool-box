declare module '@tardis-ksh/tsup-config' {
  import type { Options } from 'tsup';

  type NodeConfig = Partial<Options>;

  export const nodeConfig: NodeConfig;
  export const baseConfig: Partial<Options>;
}
