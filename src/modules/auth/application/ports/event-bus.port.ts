export interface EventBusPort {
  publish(topic: string, payload: unknown): Promise<void>;
  // si quieres soporte batch: publishAll(events[]), etc.
}
