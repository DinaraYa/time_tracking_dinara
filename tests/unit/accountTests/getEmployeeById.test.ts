import {
    accountServiceMongo
} from "../../../src/services/AccountServiceImplMongo.ts";
import {EmployeeModel} from "../../../src/model/EmployeeMongooseModel.ts";


jest.mock("../../../src/model/EmployeeMongooseModel")

describe('AccountServiceImplMongo.getEmployeeById', () => {
    test("Failed test: employee not found", async () => {
        const service = accountServiceMongo;
        (EmployeeModel.findById as jest.Mock).mockResolvedValue(null);
        await expect(service.getEmployeeById("UNKNOWN")).rejects.toThrow(`Employee with id UNKNOWN not found`)

    })
})
