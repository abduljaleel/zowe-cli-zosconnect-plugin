import { ICommandHandler, IHandlerParameters } from "@brightside/imperative";

export default class HealthCheckHandler implements ICommandHandler {
    public async process(commandParameters: IHandlerParameters): Promise<void> {
        // do nothing here, just to prevent a warning on install
    }
}
