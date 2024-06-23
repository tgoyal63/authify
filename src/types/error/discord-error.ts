export class DiscordError extends Error {
  show: boolean;
  constructor(message: string, show: boolean) {
    super(message);
    this.name = "DiscordError";
    this.show = show;
  }
}
