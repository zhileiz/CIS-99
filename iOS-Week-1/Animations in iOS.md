# Animations in iOS
There are three ways we can do animation in iOS, which also represents three levels of abstraction.

The easiest is the `UIView` Animations.
If we need more control, we will use the `UIViewPropertyAnimator`.
If performance is a concern, we will use the `CALayer` Animations.

## 1. UIView Animation
View animations are done by `UIView.animate` set of methods.

### Animating Constraints
General Pattern: change the layout constraints first, and then use `UIView.animate` methods.
```swift
menuHeightConstraint.constant = menuIsOpen ? 200 : 80
UIView.animate(
    withDuration: 0.33,
    delay: 0.0,
    options: .curveEaseIn,
    animations: {
        self.view.layoutIfNeeded()
    },
    completion: nil
)
```

### Property Animation
All properties of views can be animated. However, the view must exist at the correct frame before the animation takes place:
```swift
var snowView: SnowView!
...
UIView.animate(
    withDuration: 1.0,
    delay: 0.0,
    options: .curveEaseOut,
    animations: {
        self.snowView.alpha = showEffects ? 1.0 : 0.0
    },
    completion: nil
)
```
If the view does not exist, we need to create a temporary view first and assign `alpha` to so that it replaces original view.
```swift
let tempView = UIImageView(frame: bgImageView.frame)
tempView.image = toImage
tempView.alpha = 0.0
tempView.center.y += 20
tempView.bounds.size.width = bgImageView.bounds.width * 1.3
bgImageView.superview?
           .insertSubview(tempView, aboveSubview: bgImageView)
    
UIView.animate(
    withDuration: 0.5,
    animations: {
    //Fade temp view in
        tempView.alpha = 1.0
        tempView.center.y -= 20
        tempView.bounds.size = self.bgImageView.bounds.size
    },
    completion: { _ in
        //Update background view & view temp view
        self.bgImageView.image = toImage
        tempView.removeFromSuperview()
    }
)
```

### Key Frame Animation
We can fine tune a view's animation with keyframes. This allows us to control the exact animation at the exact moment.
```swift
UIView.animateKeyframes(
    withDuration: 1.5,
    delay: 0.0,
    animations: {
        // Create keyframes
        // Move plane right & up
        UIView.addKeyframe(withRelativeStartTime: 0.0, relativeDuration: 0.25, animations: {
            self.planeImage.center.x += 80.0
            self.planeImage.center.y -= 10.0
        })
        // Rotate plane
        UIView.addKeyframe(withRelativeStartTime: 0.1, relativeDuration: 0.4, animations: {
            self.planeImage.transform = CGAffineTransform(rotationAngle: -.pi / 8)
    })
        // Move plane right and up off screen, while fading out
        UIView.addKeyframe(withRelativeStartTime: 0.25, relativeDuration: 0.25, animations: {
            self.planeImage.center.x += 100.0
            self.planeImage.center.y -= 50.0
            self.planeImage.alpha = 0.0
        })
        // Move plane just off left side, reset transform and height
        UIView.addKeyframe(withRelativeStartTime: 0.51, relativeDuration: 0.01, animations: {
            self.planeImage.transform = .identity
            self.planeImage.center = CGPoint(x: 0.0, y: originalCenter.y)
        })
        // Move plane back to original position & fade in
        UIView.addKeyframe(withRelativeStartTime: 0.55, relativeDuration: 0.45, animations: {
            self.planeImage.alpha = 1.0
            self.planeImage.center = originalCenter
        })
    },
    completion: nil
)
```

## 2. Property Animator
Property Animators works like "Executor Service" of Java's concurrency pacakge. It is a configurable tool to manage animation.

A basic animator looks like this:
```swift
let animator : UIViewPropertyAnimator = {
    let scale = UIViewPropertyAnimator(duration: 0.5, curve: .easeIn)
    
    scale.addAnimations ({ view.alpha = 1 })
    
    scale.addAnimations({ 
        view.transform = CGAffineTransform.identity
    }, delayFactor: 0.25)
    
    scale.addCompletion { _ in print("Ready!") }
    
    return scale
}()
...
animator.startAnimation()
```

The real power of a property animator is that developers can control the progress and playback of the animation.

Property Animators maintain a set of states for the animation, which transitions in the following manner:

![Screen Shot 2019-04-05 at 11.04.56 A](media/15544173427304/Screen%20Shot%202019-04-05%20at%2011.04.56%20AM.png)

We can control the progress of the animation by setting the `fractionComplete` property:
```swift
animator.fractionComplete = max(0.01, min(0.99, percent))
```
We can reverse the animation with:
```swift
animator.isReversed = true
animator.startAnimation()
```

## 3. CALayer Animation
The motivation for CALayer animation is that UIViews are heavy. In order to perform an animation, many of the UIView's properties need to be reset, occupying CPU.

If we only want a visual transformation/transition, CALayer is a less costly operation which only delegates the work to GPU.

The way CALayers work, is that it updates the CALayer model which is cached for the GPU, and the update is notified to the *Core Animation Server* shared by all processes run on iOS.

The Core Animation Server will interact with the GPU to perform repainting specified by the animation.

Behind the scene, Core Animation Server creates a new CALayer called the "presentation layer", which is a copy of the initial layer. The GPU will animate only the presentation layer, and the initial layer doesn't change.

At the end of the animation, it is the developer's responsibility to update the initial layer. 


### Basic Layer Animator
```swift
let fadeLabelIn = CABasicAnimation(keyPath: keyPath.opacity)
fadeLabelIn.fromValue = 0.0
fadeLabelIn.toValue = 1.0
fadeLabelIn.duration = 5.0
info.layer.add(fadeLabelIn, forKey: nil)
```
Because CALayer animations are properties of CALayers, and is cached for the GPU, animation operation is performed right at the time the property is modified.

### Animation Group
A set of CALayers can be grouped together to be triggered at the same time using a `CAAnimationGroup`
```swift
let groupAnimation = CAAnimationGroup()
groupAnimation.timingFunction = CAMediaTimingFunction(name: .easeIn)
groupAnimation.beginTime = CACurrentMediaTime() + 0.5
groupAnimation.duration = 0.5
groupAnimation.fillMode = .backwards
    
let scaleDown = CABasicAnimation(keyPath: keyPath.transformScale)
scaleDown.fromValue = 3.5
scaleDown.toValue = 1.0
    
let rotate = CABasicAnimation(keyPath: keyPath.transformRotation)
rotate.fromValue = CGFloat.pi / 4
rotate.toValue = 0
    
let fade = CABasicAnimation(keyPath: keyPath.opacity)
fade.fromValue = 0.0
fade.toValue = 1.0
    
groupAnimation.animations = [scaleDown, rotate, fade]
```

