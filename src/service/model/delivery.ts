import { DeliveryStatus } from "../enum/status"

export type DeliveryModel = {
    packageId   : string
    status      : DeliveryStatus
    meta        : DeliveryMetaModel
}

export type DeliveryMetaModel = {
    sender          : string
    recipient       : string
    dispatchTime    : Date
    deliveryTime?   : Date
}

