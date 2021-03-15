# Chaos VR

[Game Link](https://josemiralles.github.io/VR-Shooter/)

[Trello Board](https://trello.com/b/z9iiNjO8/js-project#)

<br>

![VR Gameplay Gif](https://github.com/JoseMiralles/VR-Shooter/blob/main/images/chaos_vr_game_gif.gif?raw=true)

<br>

# Overview

This is a VR "shoot 'em up" style game with low poly aesthetics.

<br>

# Motivation

I spent a few months before A/a, teaching myself Unreal and Blender. This included teaching myself common game engine concepts. I had to build something with JS for one of my projects, and so I decided to try to employ these skills into a JS project.

<br>

# Tech

It turns out that Three.js is extremelly powerfull. It comes with [VR support](https://threejs.org/docs/#manual/en/introduction/How-to-create-VR-content) out of the box, and it also offers plenty of examples from which to learn how to implement things like [ray-casting](https://threejs.org/examples/?q=vr#webxr_vr_dragging), and [projectiles](https://threejs.org/examples/webxr_vr_cubes.html).

It also includes a [Clock class](https://threejs.org/docs/#api/en/core/Clock), with a `.getDelta()` method which makes animation and per-frame-updates work just like in major game engines.

Facebook recommends keeping total vertices to under 200k for all 3D assets. This is to acheive 72 frames per second on the Oculus Quest (gen 1). This is why I went with a low-poly easthetic, and with flat textures.

<br>

# Ticking / Animation

The Game class has a main `tick()` method which runs once every frame. This method then calls `tick()` all of the children of the scene that need to be animated.

The [EnemyRobot class](https://github.com/JoseMiralles/VR-Shooter/blob/main/src/scripts/enemy_robot.js#L169) contains multiple ticking functions that get delegated based on the enemy's ifecycle.

1. `mainTick()` - Ticking is delegated to this function when the bot is `spawn()`. It keeps the bot, and it's cannon aimed at the player's head (camera). And moves the bot around the level.

2. `deathTick()` - Ticking is delegated to this function as soon as the bot's health goes bellow 0. It also makes the bot descend at an increasing speed on each frame. It also calls mainTick() to mantain the bot on its predetermined path while also falling.

3. `blowUpTick()` - Hides the bot, and shows an explosion (sphere) which is scaled up on each frame.

![VR Shootdown Bot](https://github.com/JoseMiralles/VR-Shooter/blob/main/images/shot%20down.gif?raw=true)

<br>

# Recycling assets

All projectiles, tracers, sounds, and enemies are recicled.

The Audio class can only be played one at a time. Which means that the previous playback needs to end to for it to be free to ply again.

This is why [Audios](https://threejs.org/docs/#api/en/audio/Audio) are stored in an array with many instances of the same Audio class. And they are then played as needed, while also incrementing the index to avoid trying to play the same instance.

3D assets such as projectiles and enemies are all stored in extended instances of the [Group](https://threejs.org/docs/#api/en/objects/Group) class which gets populated when the game is intanciated. A Group contains a children property which is a collection that holds all children. These are then spawned, and de-spawned as needed. But never removed.

<br>

# Using a single GLTF file for all 3d assets.

All 3D meshes were built using Blender, and exported in a single GLTF file by linking all scenes into a single composite scene, which then gets exported. The [GLTFLoader](https://threejs.org/docs/#examples/en/loaders/GLTFLoader) from THREE.js is then used to load all assets into an array of scenes and meshes.

The file is currently less than 700kb, at the time of writting.

<br>
