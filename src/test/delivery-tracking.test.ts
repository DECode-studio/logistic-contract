import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractTransactionResponse } from "ethers";

import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import {
    DeliveryTracking,
    DeliveryTracking__factory
} from "../../typechain-types";

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
            await contract.connect(user).createDelivery("PKG001", owner.address);
            const status = await contract.getStatus("PKG001");

            expect(status).to.equal(1); // Status.Dispatched
        });

        it("should update status to Delivered", async () => {
            await contract.connect(user).createDelivery("PKG002", owner.address);
            await contract.updateStatus("PKG002", 3); // Delivered
            const status = await contract.getStatus("PKG002");
            expect(status).to.equal(3);
        });
    }
)