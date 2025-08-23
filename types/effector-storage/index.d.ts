import type { Subscription } from 'effector'
import type {
  ConfigAdapter,
  ConfigAdapterFactory,
  ConfigPersist,
  ConfigStore,
  ConfigSourceTarget,
} from 'effector-storage'

// override effector-storage's `Persist` interface to make it more loose
declare module 'effector-storage' {
  export interface Persist {
    // biome-ignore lint/style/useShorthandFunctionType: this has to be interface for declaration merging
    <State, Err = Error>(
      config: Partial<
        (ConfigAdapter | ConfigAdapterFactory<any>) &
          ConfigPersist &
          ConfigStore<State, Err> &
          ConfigSourceTarget<State, Err>
      >
    ): Subscription
  }
}
