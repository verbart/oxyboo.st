'use client';

import { useCallback } from 'react';
import type { Container, Engine } from 'tsparticles-engine';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';

export default function ParticlesComponent() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    // Optional: Add any initialization after particles are loaded
  }, []);

  return (
    <Particles
      className="absolute inset-0 pointer-events-none"
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        background: {
          opacity: 0
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onHover: {
              enable: false
            }
          }
        },
        particles: {
          color: {
            value: '#3B82F6'
          },
          links: {
            color: '#3B82F6',
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1
          },
          move: {
            enable: true,
            direction: 'none',
            outModes: {
              default: 'bounce'
            },
            random: false,
            speed: 1,
            straight: false
          },
          number: {
            density: {
              enable: true,
              area: 800
            },
            value: 80
          },
          opacity: {
            value: 0.2
          },
          size: {
            value: { min: 1, max: 3 }
          }
        },
        detectRetina: true
      }}
    />
  );
}
