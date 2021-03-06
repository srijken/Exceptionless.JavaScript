import { Configuration } from '../configuration/Configuration';
import { IEvent } from '../models/IEvent';

describe('DefaultEventQueue', () => {
  function getConfiguration(): Configuration {
    var config:Configuration = new Configuration({
      apiKey:'LhhP1C9gijpSKCslHHCvwdSIz298twx271n1l6xw',
      serverUrl:'http://localhost:50000'
    });

    expect(config.storage.getList().length).toBe(0);
    return config;
  }

  it('should enqueue event', () => {
    var config:Configuration = getConfiguration();
    var event:IEvent = { type: 'log', reference_id: '123454321' };
    config.queue.enqueue(event);
    expect(config.storage.getList().length).toBe(1);
  });

  it('should process queue', () => {
    var config:Configuration = getConfiguration();
    var event:IEvent = { type: 'log', reference_id: '123454321' };
    config.queue.enqueue(event);
    expect(config.storage.getList().length).toBe(1);
    config.queue.process();

    if (!(<any>config.queue)._suspendProcessingUntil) {
      expect(config.storage.getList().length).toBe(0);
    } else {
      expect(config.storage.getList().length).toBe(1);
    }
  });

  it('should discard event submission', () => {
    var config:Configuration = getConfiguration();
    config.queue.suspendProcessing(1, true);

    var event:IEvent = { type: 'log', reference_id: '123454321' };
    config.queue.enqueue(event);
    expect(config.storage.getList().length).toBe(0);
  });

  it('should suspend processing', (done) => {
    var config:Configuration = getConfiguration();
    config.queue.suspendProcessing(.0001);

    var event:IEvent = { type: 'log', reference_id: '123454321' };
    config.queue.enqueue(event);
    expect(config.storage.getList().length).toBe(1);

    setTimeout(() => {
      if (!(<any>config.queue)._suspendProcessingUntil) {
        expect(config.storage.getList().length).toBe(0);
      } else {
        expect(config.storage.getList().length).toBe(1);
      }

      done();
    }, 10000);
  }, 21000);
});
