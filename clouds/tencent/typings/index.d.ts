declare namespace Tencent {
  interface Credentials {
    secretId: string;
    secretKey: string;
  }

  interface CdnCommonParameter {
    /**
     * mainland: 境内节点
     * overseas: 境外节点
     * global: 全球节点（部分接口可用）
     */
    Area?: 'mainland' | 'overseas' | 'global';

    // 是否对URL进行编码
    UrlEncode?: boolean;
  }
}
