# Demystifying iOS Views: From Core Graphics to UIView

![Screen Shot 2019-04-04 at 1.37.37 P](media/15543990658844/Screen%20Shot%202019-04-04%20at%201.37.37%20PM.png)

## 1. UIView
In iOS, `UIView` is the basic unit of what users see.
Since `UIView` subclasses `UIResponder`, a view is also subject to user interaction.

Views can have hierarchy, each view can have a number of subviews, this results in a tree of views called *view hierarchy*. 

The top of the view hierarchy is the app's window, an instance of `UIWindow`, which is a `UIView` subclass. 
An app has **exactly** 1 main window, so the structure to some extent, resembles a DOM tree in web.

### 1.1. SubViews and SuperView
A UIView has a `superview : UIView` property and a `subviews : [UIView]` property

Superviews retain their subviews in the memory management. A superview releases a subview when the subview is removed from the superview's `subviews`, and when the superview itself is removed from its `superview`.

If a view is removed from or moved within its superview, its subviews go with it.

A Superview can optionally limit the drawing of its subviews so that any parts of them outside the view are not shown. This is called **clipping**.

#### 1.1.1. Referencing a Subview
Apart from using navigating the view hierarchy with `superview` and `subviews`, `isDescendant(of:)` lets you check whether one view is a subview of another view.

A view has an `tag : Int` property. Using `viewWithTag(_:)` from any view higher up in the view hierarchy can find the vie with the specified `tag`.

#### 1.1.2. Adding a Subview
The method `addSubview(_:)` makes one view a subview of another.

When `addSubview(_:)` is called, the view is placed last among its superview's subviews.

Sibling subviews of the same view are drawn in order. This means the latest added view will be drawn last, and hence will appear frontmost.

In order to customize the behavior of adding subviews, you can do:
```swift
insertSubView(_: at:),
insertSubView(_: aboveSubView: ), insertSubView(_: belowSubView: ),
exchangeSubview(at: withSubviewAt: ),
bringSubviewToFront(_:), sendSubviewToBack(_:)
```

#### 1.1.3. Removing a Subview
`removeFromSuperview` takes a subview out of tis superview's view hierarchy.

The superview release the subview when that subview is removed. So if further reference of the removed subview is needed, it must be retained elsewhere.

#### 1.1.4. Events
Subclasses of views can override and implement methods to handle view dynamic change events:
```swift
willRemoveSubview(_:), didAddSubview(_:),
willMove(toSuperview:), didMoveToSuperview(),
willMove(toWindow:), didMoveToWindow()
```


### 1.2. Frame, Bounds and Center
A view's `frame : CGRect` describes the view's rectangle in its *superview's* coordinates
A view's `bound : CGRect` describes the view's rectangle in its *own* coordinates.
A view‘s `center : CGPoint` is the single point establishing the positional relationship between the view's bounds and its superview's bounds, and is consistent with the `frame` after each render.

```swift
let rect = CGRect(x: 50, y: 50, width: 300, height: 400)
let canvas = UIView(frame: rect)
view.addSubview(canvas);

//=> view.frame = (50, 50, 300, 400)
//=> view.bound = (0, 0, 300, 400)
//=> view.center = (200, 250)
```
If you change a view's `bound.origin`, you move the origin of its internal coordinate system. 
Its subviews will thus experience a shift in layout.

If you change a view's `bound.size`, the change will take effect on the view around its `center`. 
The size of the frame will change accordingly.

#### 1.2.1 Coordinate Conversion
Each view has its own coordinate system expressed by its `bounds`
Each view's coordinate system has a clear relationship to the view's superview's coordinates expressed by the view's `center`.
We can use `convert(_: to:)` and `convert(_: from:)` methods to get the CGPoint of a view relative to another.
eg. 1: `v2` is a subview of `v1`, we want to center `v2` in `v1`, then we have:
```swift
v2.center = v1.convert(v1.center, from: v1.superview) // correct
// wrong: v2.center = v1.center
```
In the above example, we see that `convert` returns a CGPoint that is relative to the coordinate system of `v1.bound`.

`v1.convert(p, from: v2)` means: in `v1.bound`'s coordinates term, what does the point `p` in `v2.bounds`'s coordinate translate to?
Similarly, `v1.convert(p, to: v2)` means: what does a point `p` in `v1.bounds`'s coordinate translate to in `v2.bounds`?

Note that if the `from` or `to` value is nil, UIWindow is used. This is sometimes desirable.




## 2. Core Animation
Core Animation is not a drawing system itself. It is an infrastructure for compositing and manipulating your app’s content in hardware.

With view-based drawing, changes to the view itself often result in a call to the view’s `drawRect:` method to redraw content using the new parameters. But drawing in this way is expensive because it is done using the CPU on the main thread. 

Core Animation avoids this expense by whenever possible by manipulating the cached bitmap in graphics hardware to achieve the same or similar effects

### 2.1. CALayer
At the heart of Core Animation is `CALayer`. A UIView has an accompanying `CALayer`, which can be accessed by `view.layer` property.  A layer captures your content into a bitmap that can be manipulated easily by the graphics hardware.

Layers can be arranged hierarchically to create parent-child relationships. The arrangement of layers affects the visual content that they manage in a way that is similar to views.

There are 10 types of CALayers: 
```swift
CALayer, CATextLayer, CAShapeLayer, 
CAGradietnLayer, CAEmitterLayer, 
CAScrollLayer, CATiledLayer, 
CATransformLayer, CAReplicatorLayer,
AVPlayerLayer
```

#### 2.1.2. CAShapeLayer
`CAShapeLayer` can be bind with a `CGPath`.
```swift
let shapeLayer : CAShapeLayer {
    let layer = CAShapeLayer()
    let uiPath = UIBezierPath()
    uiPath.addLine(to:CGPoint(x: 249.57, y: 143.79))
    uiPath.addCurve(to:CGPoint(x: 249.37, y: 38.25), 
                    controlPoint1: CGPoint(x: 249.57, y: 85.64), 
                    controlPoint2: CGPoint(x: 249.47, y: 38.15))
    uiPath.close()
    layer.path = rwPath.cgPath
    layer.fillColor = rwColor.cgColor
    return layer
}()

```
One very clever use case of CAShapeLayer is adding rounded corners to `UIImageView`. 

Although UIView offers higher lever API: `clipsToBound`, it is notoriously inefficient, because on every reallocation of the view, `clipsToBound` uses the CPU to recalculate.

Using a CAShapeLayer, and mask the UIImageView's layer to its bound is very efficient, because the layer is then cached with the GPU.

```swift
extension CALayer {
    func applyRoundCornerMaskWith(radius: CGFloat) {
        let path:UIBezierPath = UIBezierPath.init(roundedRect: self.bounds,
                                                  cornerRadius: radius)
        let layer = CAShapeLayer.init()
        layer.path = path.cgPath
        layer.frame = self.bounds
        self.mask = layer
    }
}

imageView.layer.applyRoundCornerMaskWith(radius: 5)
```


### 2.2. Animation
One of the most significant use case of CALayers is in animation. CALayer Animation provide much better performance than UIView Animations.

Details can be seen in *Animations in iOS*

## 3. Core Graphics
Core graphics provides low-level, lightweight 2D rendering. It is based upon *Quartz 2D*, a C-API that manages the graphic context and implements drawing. 

Core graphics handles path-based drawing, transformations, color management, offscreen rendering, patterns, gradients and shadings, image data management, image creation, and image masking, as well as PDF document creation, display, and parsing.

Why do we need Core Graphics? Sometimes, developers wish to create view assets in code, especially when vector-based drawing is needed. 

### 2.1. CGContext
When we draw using Core Graphics, we draw into a `CGContext`, that is we must have a Graphics Context in the first place. 

There are three ways to obtain the `CGContext`:

**a. Cocoa creates the graphics context**
You subclass `UIView` and implement `draw(_:)`. At the time your `draw(_:)` implementation is called, Cocoa has already created a graphics context and is asking you to draw into it, right now; whatever you draw is what the UIView will display.

**b. Cocoa passes you a graphics context**
You subclass `CALayer` and implement `draw(in:)`. The `in:` parameter is a graphics context. (Layers are discussed in Chapter 3.)


### 2.2. Drawing with Core Graphics

#### Basic Drawing
Inside `draw(in:)`, we don't need to specify the context, since it's implicit.
```swift
class CloseButton: UIButton {
  
  override func draw(_ rect: CGRect) {
    let circle = UIBezierPath(ovalIn: rect.insetBy(dx: 5, dy: 5))
    
    // set the property of the implicit context
    UIColor.gray.setFill()
    // Use the implicit CGContext to draw circle and fill color
    circle.fill()
    
    let path = UIBezierPath()
    path.move(to: CGPoint(x: rect.width / 3, y: top))
    path.addLine(to: CGPoint(x: rect.height / 3, y: bottom))
    path.move(to: CGPoint(x: rect.width * 2/3, y: top))
    path.addLine(to: CGPoint(x: rect.height * 2/3, y: bottom))
    path.lineWidth = 2
    
    // set the property of the implicit context
    UIColor.white.setStroke()
    // Use the implicit CGContext to draw circle and fill color
    path.stroke()
  }
}
```

Core Graphics is a very old technology at a very low level. So its usage is deviates a little from the OOP paradigm. 

#### Image Rendering
```swift
let r = UIGraphicsImageRenderer(size: CGSize(sz.width*1.5, sz.height), 
                                format: mars.imageRendererFormat) 
let im = r.image { ctx in
    let con = ctx.cgContext 
    con.draw(marsLeft, in: CGRect(0,0,sz.width/2.0,sz.height)) 
    con.draw(marsRight, in: CGRect(sz.width,0,sz.width/2.0,sz.height))
}
```
