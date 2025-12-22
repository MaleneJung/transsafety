export interface SafeUserServiceCredentialDataModel {
  key: string
  value: string
}

export interface SafeCredentialTransformerDataModel {
  keyName: string
  valueTransformer: string
}

export interface SafeUserServiceDataModel {
  userName: string
  serviceName: string
  credentials: SafeUserServiceCredentialDataModel[]
}

export interface SafeDataModel {
  transformers: SafeCredentialTransformerDataModel[]
  credentials: SafeUserServiceDataModel[]
}
