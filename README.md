# VR-Shooter

[Trello Board](https://trello.com/b/z9iiNjO8/js-project#)

<br>

# Overview

This will be a VR "shoot 'em up" style game with low poly aesthetics. I expect this project to be challenging, but do-able.

<br>

# MVPs

- Shootable guns
- Enemies / targets ( Will move around player. )
- Damage system for player, and enemies.
- Enviroment (includes stereoscopic panoramic background)

### Bonus:

- Textures
- Music
- Multiple gun types
- High scores

<br>

# Tech

I will be using Three JS to build it. Three JS comes with [VR support](https://threejs.org/docs/#manual/en/introduction/How-to-create-VR-content) out of the box. And also offers many demos [such as this one](https://threejs.org/examples/webxr_vr_cubes.html), which shows how to shoot cubes out the user's hands when they press the trigger buttons.

Shooting will work using projectiles, but might switch to ray casting for optimization purposes. [This demo](https://threejs.org/examples/?q=vr#webxr_vr_dragging) uses ray casting (from the controller) to pick and grab objects from a distance.

Facebook recommends keeping total vertices to under 200k for all assets. This is to acheive 72 frames per second on the Oculus Quest (gen 1). Because of this, 3D meshes will follow a low poly aesthetic.  The game will also either have low resolution textures, or a flat color palette for optimization purposes.

Meshes will be built using Blender, and textured using Quixel Mixer.

<br>

# Timeline

- Pistol meshes: Day one, 4pm
- Firing: Day two, 1pm
- Targets: Day two, 6pm
- Targets shooting back: Day three, 4pm
- Player damage: Day four, 12pm
- Target damage: Day four, 6pm
- Enviroment: Day five, 6pm
