import { IncomingHttpHeaders } from "node:http";
import { HTTP_METHODS } from "../../../app/server_app/model/ServerModel";


export class RequestTestWrapper {

  public body: object | undefined;
  public method: HTTP_METHODS | undefined;
  public url: string | undefined;
  public headers: IncomingHttpHeaders = {};

  public on(event : any, cb : any) {
    if(event == 'data') {
      cb(JSON.stringify(this.body));
    } else {
      cb()
    }
  }

  public clearFields() {
    this.body = undefined;
    this.method = undefined;
    this.url = undefined;
    this.headers = {};
  }
}