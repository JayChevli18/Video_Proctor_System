// test-tf.ts
import '@tensorflow/tfjs-node';
import * as tf from '@tensorflow/tfjs';
console.log((tf.backend() as any).tf.version_full || tf.version_core);