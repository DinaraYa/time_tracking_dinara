

import {accountServiceMongo} from "../../../src/services/AccountServiceImplMongo.ts";
import {EmployeeModel} from "../../../src/model/EmployeeMongooseModel.ts";


jest.mock("../../../src/model/EmployeeMongooseModel.ts");

describe('AccountServiceImplMongo.GetAllEmployees -', () => {
    const service = accountServiceMongo;
    const SavedFiredEmployees = [{
        _id: "123",
        firstName: "MockEmp",
        lastName: "MOCK",
        table_num: "tab_num",
        fireDate: "yesterday"
    },
        {
            _id: "444",
            firstName: "Another",
            lastName: "Employee",
            table_num: "tab_num_2",
            fireDate: "last_year"
        }
    ];
    test("Positive test: ", async () => {

        (EmployeeModel.find as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(SavedFiredEmployees)
        });
        await expect(service.getAllEmployees())
            .resolves.toEqual(SavedFiredEmployees);
        expect(EmployeeModel.find).toHaveBeenCalledWith();
    })
})