import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractTransactionResponse } from "ethers";

import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import {
    DeliveryTracking,
    DeliveryTracking__factory
} from "../../typechain-types";
import { DeliveryMetaModel, DeliveryModel } from "../service/model/delivery";
import { DeliveryStatus } from "../service/enum/status";
import { decryptData, encryptData } from "../service/encryption";

describe(
    'Delivery Tracking',
    () => {
        let DeliveryTracking: DeliveryTracking__factory
        let contract: DeliveryTracking & {
            deploymentTransaction(): ContractTransactionResponse;
        }

        let owner: HardhatEthersSigner
        let user: HardhatEthersSigner

        beforeEach(async () => {
            [owner, user] = await ethers.getSigners();

            DeliveryTracking = await ethers.getContractFactory("DeliveryTracking");
            contract = await DeliveryTracking.deploy();

            await contract.waitForDeployment();
        });

        it("should create a delivery", async () => {
            const packageId = 'PKG001'
            const data: DeliveryMetaModel = {
                sender: owner.address,
                recipient: user.address,
                dispatchTime: new Date(Date.now())
            }
            const encryptedData = encryptData(JSON.stringify(data))

            await contract.connect(user).createDelivery(packageId, encryptedData);
            const status = await contract.getStatus(packageId);

            console.log(JSON.stringify(data));
            console.log(encryptedData);
            expect(status).to.equal(DeliveryStatus.Dispatched); // Status.Dispatched
        });

        it("should update status to Delivered", async () => {
            const packageId = 'PKG002'
            const data: DeliveryMetaModel = {
                sender: owner.address,
                recipient: user.address,
                dispatchTime: new Date(Date.now())
            }
            let encryptedData = encryptData(JSON.stringify(data))

            console.log(JSON.stringify(data));
            console.log(encryptedData);

            await contract.connect(user).createDelivery(
                packageId, encryptedData
            );

            data.deliveryTime = new Date(Date.now())
            encryptedData = encryptData(JSON.stringify(data))
            await contract.updateStatus(
                packageId,
                DeliveryStatus.Delivered,
                encryptedData
            ); // Delivered

            console.log(JSON.stringify(data));
            console.log(encryptedData);

            const status = await contract.getStatus(packageId);
            expect(status).to.equal(3);
        });

        it("should get delivery data", async () => {
            const packageId = 'PKG003'
            const data: DeliveryMetaModel = {
                sender: owner.address,
                recipient: user.address,
                dispatchTime: new Date(Date.now())
            }
            let encryptedData = encryptData(JSON.stringify(data))

            await contract.connect(user).createDelivery(
                packageId, encryptedData
            );

            data.deliveryTime = new Date(Date.now())
            encryptedData = encryptData(JSON.stringify(data))
            await contract.updateStatus(
                packageId,
                DeliveryStatus.Delivered,
                encryptedData
            );

            const [id, status, meta] = await contract.connect(user).getDelivery(
                packageId
            );

            console.log(id);
            console.log(Number(status));
            console.log(meta);

            const result: DeliveryModel = {
                packageId: id,
                status: Number(status),
                meta: JSON.parse(decryptData(meta))
            }

            console.log(result);
        });
    }
)