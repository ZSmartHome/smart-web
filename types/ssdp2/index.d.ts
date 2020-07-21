declare module "ssdp2" {

  type action = 'response';

  export default class SSDP {
    constructor(config: { port: number })

    on(response: action, action: (response: object) => void): undefined;

    search(locator: string): SSDP;
  }
}
