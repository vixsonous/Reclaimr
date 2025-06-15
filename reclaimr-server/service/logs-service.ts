export class LogsService {

  static info(message: string) {
    const d = new Date().toISOString();
    const [dt, tm] = d.split("T");
    console.info("[INFO]: " + message + `[T: ${dt} ${tm}]`);
  }
  
  static error(message: string) {
    const d = new Date().toISOString();
    const [dt, tm] = d.split("T");
    console.error("[ERROR]: " + message + `[T: ${dt} ${tm}]`);
  }

  static log(message: string) {
    const d = new Date().toISOString();
    const [dt, tm] = d.split("T");
    console.log("[LOG]: " + message + `[T: ${dt} ${tm}]`);
  }
}