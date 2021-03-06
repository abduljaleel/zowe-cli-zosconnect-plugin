import {ICommandHandler, IHandlerParameters} from "@brightside/imperative";
import { RequestError, StatusCodeError } from "request-promise/errors";
import { ZosConnectApi } from "../../../api/api/ZosConnectApi";
import { ConnectionUtil } from "../../../connection";

export default class ApiListHandler implements ICommandHandler {
    public async process(commandParameters: IHandlerParameters): Promise<void> {
        const profile = commandParameters.profiles.get("zosconnect");
        const session = ConnectionUtil.getSession(profile);
        try {
            const apis = await ZosConnectApi.list(session);
            for (const api of apis) {
                commandParameters.response.console.log(`${api.name}(${api.version}) - ${api.description}`);
            }
            commandParameters.response.data.setObj(apis);
        } catch (error) {
            switch (error.constructor) {
                case StatusCodeError:
                    const statusCodeError = error as StatusCodeError;
                    switch (statusCodeError.statusCode) {
                        case 401:
                        case 403:
                            commandParameters.response.console.error("Security error, unable to display APIs");
                            break;
                        default:
                            commandParameters.response.console.error(statusCodeError.message);
                    }
                    break;
                case RequestError:
                    commandParameters.response.console.error(`Unable to connect to ${session.address}`);
                    break;
                default:
                    commandParameters.response.console.error(error);
            }

        }
    }
}
