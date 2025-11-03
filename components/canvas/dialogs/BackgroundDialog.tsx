"use client";

import { useState, useEffect } from "react";
import { ImageSquare as ImageIcon, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useDropzone } from "react-dropzone";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/lib/constants";
import { useCanvasContext } from "../CanvasContext";
import { getCldImageUrl } from "@/lib/cloudinary";
import { cloudinaryPublicIds } from "@/lib/cloudinary-backgrounds";
import Konva from "konva";

const BACKGROUND_PREFS_KEY = "canvas-background-prefs";

interface BackgroundPreferences {
  type: "solid" | "gradient" | "image";
  backgroundColor?: string;
  gradientColors?: string[];
  gradientType?: "linear" | "radial";
  backgroundImageUrl?: string | null; // Only saved if it's a Cloudinary public ID
  backgroundBlur?: number; // Blur radius for background images (0-100)
}
interface BackgroundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BackgroundDialog({ open, onOpenChange }: BackgroundDialogProps) {
  const { stage, layer } = useCanvasContext();
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [backgroundType, setBackgroundType] = useState<"solid" | "gradient" | "image">("solid");
  const [gradientColors, setGradientColors] = useState(["#ffffff", "#3b82f6"]);
  const [gradientType, setGradientType] = useState<"linear" | "radial">("linear");
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(null);
  const [backgroundBlur, setBackgroundBlur] = useState(0);
  const [bgUploadError, setBgUploadError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Use Cloudinary public IDs only
  const staticBackgrounds: string[] = cloudinaryPublicIds;

  // Save preferences to localStorage
  const savePreferences = () => {
    const prefs: BackgroundPreferences = {
      type: backgroundType,
      backgroundColor,
      gradientColors,
      gradientType,
      // Only save image URL if it's a Cloudinary public ID (not a blob URL)
      backgroundImageUrl: backgroundImageUrl && !backgroundImageUrl.startsWith("blob:") 
        ? backgroundImageUrl 
        : null,
      backgroundBlur,
    };
    localStorage.setItem(BACKGROUND_PREFS_KEY, JSON.stringify(prefs));
  };

  // Load preferences from localStorage
  const loadPreferences = (): BackgroundPreferences | null => {
    try {
      const saved = localStorage.getItem(BACKGROUND_PREFS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Failed to load background preferences:", error);
    }
    return null;
  };

  // Load preferences on mount
  useEffect(() => {
    const prefs = loadPreferences();
    if (prefs) {
      if (prefs.backgroundColor) setBackgroundColor(prefs.backgroundColor);
      if (prefs.type) setBackgroundType(prefs.type);
      if (prefs.gradientColors) setGradientColors(prefs.gradientColors);
      if (prefs.gradientType) setGradientType(prefs.gradientType);
      if (prefs.backgroundImageUrl) setBackgroundImageUrl(prefs.backgroundImageUrl);
      if (prefs.backgroundBlur !== undefined) setBackgroundBlur(prefs.backgroundBlur);
    }
    setIsInitialized(true);
  }, []);

  // Listen for restore-background event (triggered when loading a design)
  useEffect(() => {
    const handleRestoreBackground = async (event: CustomEvent) => {
      const prefs = event.detail;
      if (prefs && stage && layer) {
        setBackgroundColor(prefs.backgroundColor || "#ffffff");
        setBackgroundType(prefs.type || "solid");
        if (prefs.gradientColors) setGradientColors(prefs.gradientColors);
        if (prefs.gradientType) setGradientType(prefs.gradientType);
        if (prefs.backgroundImageUrl) setBackgroundImageUrl(prefs.backgroundImageUrl);
        if (prefs.backgroundBlur !== undefined) setBackgroundBlur(prefs.backgroundBlur);
        
        // Trigger background update after a short delay to ensure state is set
        setTimeout(async () => {
          if (prefs.type === "solid" && prefs.backgroundColor) {
            updateCanvasBackground(prefs.backgroundColor);
          } else if (prefs.type === "gradient" && prefs.gradientColors) {
            // Handle gradient restoration
            const bgRect = layer.findOne((node: any) => node.id() === "canvas-background") as Konva.Rect;
            if (bgRect && bgRect instanceof Konva.Rect) {
              if (prefs.gradientType === "linear") {
                const linearGradient = {
                  start: { x: 0, y: 0 },
                  end: { x: bgRect.width(), y: bgRect.height() },
                  colorStops: prefs.gradientColors.flatMap((color: string, index: number) => [
                    index / (prefs.gradientColors.length - 1),
                    color,
                  ]),
                };
                bgRect.fillLinearGradientStartPoint(linearGradient.start);
                bgRect.fillLinearGradientEndPoint(linearGradient.end);
                bgRect.fillLinearGradientColorStops(linearGradient.colorStops);
                bgRect.fillPriority('linear-gradient');
                bgRect.fillRadialGradientColorStops([]);
                bgRect.fillPatternImage(null);
              } else {
                // Radial gradient
                const centerX = bgRect.width() / 2;
                const centerY = bgRect.height() / 2;
                const radius = Math.max(bgRect.width(), bgRect.height()) / 2;
                bgRect.fillRadialGradientStartPoint({ x: centerX, y: centerY });
                bgRect.fillRadialGradientEndPoint({ x: centerX, y: centerY });
                bgRect.fillRadialGradientStartRadius(0);
                bgRect.fillRadialGradientEndRadius(radius);
                bgRect.fillRadialGradientColorStops(
                  prefs.gradientColors.flatMap((color: string, index: number) => [
                    index / (prefs.gradientColors.length - 1),
                    color,
                  ])
                );
                bgRect.fillPriority('radial-gradient');
                bgRect.fillLinearGradientColorStops([]);
                bgRect.fillPatternImage(null);
              }
              layer.batchDraw();
            }
          } else if (prefs.type === "image" && prefs.backgroundImageUrl) {
            // Handle image background restoration - actually load the image
            try {
              await updateCanvasBackgroundImage(prefs.backgroundImageUrl, prefs.backgroundBlur || 0);
            } catch (error) {
              console.error("Failed to restore background image:", error);
              // Fallback to solid color if image fails to load
              updateCanvasBackground(prefs.backgroundColor || "#ffffff");
            }
          }
        }, 150);
      }
    };

    const eventHandler = (event: Event) => {
      handleRestoreBackground(event as CustomEvent);
    };
    window.addEventListener("restore-background", eventHandler);
    return () => {
      window.removeEventListener("restore-background", eventHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, layer]);

  // Restore background when canvas is ready and preferences are loaded
  useEffect(() => {
    if (!isInitialized || !stage || !layer) return;

    const prefs = loadPreferences();
    if (!prefs) return;

    // Restore based on saved type
    if (prefs.type === "solid" && prefs.backgroundColor) {
      const bgRect = layer.findOne((node: any) => node.id() === "canvas-background") as Konva.Rect;
      if (bgRect && bgRect instanceof Konva.Rect) {
        bgRect.fillPatternImage(null);
        bgRect.fillLinearGradientColorStops([]);
        bgRect.fillRadialGradientColorStops([]);
        bgRect.fill(prefs.backgroundColor);
        bgRect.fillPriority('color');
        layer.batchDraw();
      }
    } else if (prefs.type === "gradient" && prefs.gradientColors && prefs.gradientType) {
      const bgRect = layer.findOne((node: any) => node.id() === "canvas-background") as Konva.Rect;
      if (bgRect && bgRect instanceof Konva.Rect) {
        // Clear all previous fills first
        bgRect.fill(null); // Clear solid color fill
        bgRect.fillPatternImage(null); // Clear image pattern
        bgRect.fillLinearGradientColorStops([]); // Clear linear gradient
        bgRect.fillRadialGradientColorStops([]); // Clear radial gradient
        
        const colorStopsArray: (number | string)[] = [];
        prefs.gradientColors.forEach((color, index) => {
          const offset = prefs.gradientColors!.length === 1 ? 0 : index / Math.max(1, prefs.gradientColors!.length - 1);
          colorStopsArray.push(offset);
          colorStopsArray.push(color);
        });
        
        if (prefs.gradientType === "linear") {
          bgRect.fillLinearGradientColorStops(colorStopsArray);
          bgRect.fillLinearGradientStartPoint({ x: 0, y: 0 });
          bgRect.fillLinearGradientEndPoint({ x: stage.width(), y: stage.height() });
          bgRect.fillRadialGradientColorStops([]);
          bgRect.fillRadialGradientStartRadius(0);
          bgRect.fillRadialGradientEndRadius(0);
          bgRect.fillPriority('linear-gradient');
        } else {
          const centerX = stage.width() / 2;
          const centerY = stage.height() / 2;
          const radius = Math.max(stage.width(), stage.height()) / 2;
          bgRect.fillRadialGradientColorStops(colorStopsArray);
          bgRect.fillRadialGradientStartPoint({ x: centerX, y: centerY });
          bgRect.fillRadialGradientStartRadius(0);
          bgRect.fillRadialGradientEndPoint({ x: centerX, y: centerY }); // End point at center
          bgRect.fillRadialGradientEndRadius(radius);
          bgRect.fillLinearGradientColorStops([]);
          bgRect.fillPriority('radial-gradient');
        }
        layer.batchDraw();
      }
    } else if (prefs.type === "image" && prefs.backgroundImageUrl) {
      // Only restore if it's a Cloudinary public ID
      if (!prefs.backgroundImageUrl.startsWith("blob:")) {
        updateCanvasBackgroundImage(prefs.backgroundImageUrl, prefs.backgroundBlur || 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, stage, layer]);

  // Save preferences whenever they change
  useEffect(() => {
    if (!isInitialized) return;
    savePreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backgroundColor, backgroundType, gradientColors, gradientType, backgroundImageUrl, backgroundBlur, isInitialized]);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return `File type not supported. Please use: ${ALLOWED_IMAGE_TYPES.join(", ")}`;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return `File size too large. Maximum size is ${MAX_IMAGE_SIZE / 1024 / 1024}MB`;
    }
    return null;
  };

  const updateCanvasBackground = (color: string) => {
    if (layer) {
      const bgRect = layer.findOne((node: any) => node.id() === "canvas-background") as Konva.Rect;
      if (bgRect && bgRect instanceof Konva.Rect) {
        // Clear all previous fills and gradients
        bgRect.fillPatternImage(null);
        bgRect.fillLinearGradientColorStops([]);
        bgRect.fillRadialGradientColorStops([]);
        bgRect.fill(null); // Clear any gradient fills
        bgRect.fill(color); // Set solid color
        // Set fill priority to color to ensure solid fill is used
        bgRect.fillPriority('color');
        layer.batchDraw();
      }
    }
  };

  const updateCanvasGradient = (colors: string[], type: "linear" | "radial") => {
    if (layer && stage) {
      const bgRect = layer.findOne((node: any) => node.id() === "canvas-background") as Konva.Rect;
      if (bgRect && bgRect instanceof Konva.Rect) {
        // Clear all previous fills first - this is crucial for proper transition
        bgRect.fill(null); // Clear solid color fill
        bgRect.fillPatternImage(null); // Clear image pattern
        bgRect.fillLinearGradientColorStops([]); // Clear linear gradient
        bgRect.fillRadialGradientColorStops([]); // Clear radial gradient
        
        const colorStopsArray: (number | string)[] = [];
        colors.forEach((color, index) => {
          const offset = colors.length === 1 ? 0 : index / Math.max(1, colors.length - 1);
          colorStopsArray.push(offset);
          colorStopsArray.push(color);
        });
        
        if (type === "linear") {
          // Set linear gradient
          bgRect.fillLinearGradientColorStops(colorStopsArray);
          bgRect.fillLinearGradientStartPoint({ x: 0, y: 0 });
          bgRect.fillLinearGradientEndPoint({ x: stage.width(), y: stage.height() });
          // Ensure radial is cleared
          bgRect.fillRadialGradientColorStops([]);
          bgRect.fillRadialGradientStartRadius(0);
          bgRect.fillRadialGradientEndRadius(0);
          // Set fill priority to linear-gradient - THIS IS CRITICAL!
          bgRect.fillPriority('linear-gradient');
        } else {
          // Set radial gradient - both start and end points should be at center for circular gradient
          const centerX = stage.width() / 2;
          const centerY = stage.height() / 2;
          const radius = Math.max(stage.width(), stage.height()) / 2;
          
          // Clear linear gradient first
          bgRect.fillLinearGradientColorStops([]);
          
          // Set radial gradient properties
          // For radial gradient in Konva, both start and end points should be at the center
          // The radius difference between start and end defines the gradient
          bgRect.fillRadialGradientColorStops(colorStopsArray);
          bgRect.fillRadialGradientStartPoint({ x: centerX, y: centerY });
          bgRect.fillRadialGradientStartRadius(0);
          bgRect.fillRadialGradientEndPoint({ x: centerX, y: centerY }); // End point at center too
          bgRect.fillRadialGradientEndRadius(radius);
          bgRect.fillPriority('radial-gradient');
        }
        
        layer.batchDraw();
      }
    }
  };

  const updateCanvasBackgroundImage = async (imageUrl: string, blur: number = backgroundBlur) => {
    if (layer && stage) {
      try {
        // Remove existing background image node if it exists
        const existingBgImage = layer.findOne((node: any) => node.id() === "canvas-background-image");
        if (existingBgImage) {
          existingBgImage.destroy();
        }

        // imageUrl can be a Cloudinary public ID or a blob URL
        const isCloudinary = !imageUrl.startsWith("blob:") && !imageUrl.startsWith("http");
        const optimizedUrl = isCloudinary
          ? getCldImageUrl({
              src: imageUrl,
              width: stage.width(),
              height: stage.height(),
              quality: 'auto',
              format: 'auto',
              crop: 'fill',
              gravity: 'auto',
            })
          : imageUrl;
        
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image();
          image.crossOrigin = "anonymous";
          
          const timeout = setTimeout(() => {
            reject(new Error("Image load timeout"));
          }, 10000);
          
          image.onload = () => {
            clearTimeout(timeout);
            resolve(image);
          };
          image.onerror = (err) => {
            clearTimeout(timeout);
            reject(err);
          };
          
          image.src = optimizedUrl;
        });

        const bgRect = layer.findOne((node: any) => node.id() === "canvas-background") as Konva.Rect;
        if (bgRect && bgRect instanceof Konva.Rect) {
          // Clear previous fills
          bgRect.fill(null);
          bgRect.fillLinearGradientColorStops([]);
          bgRect.fillRadialGradientColorStops([]);
          bgRect.fillPatternImage(null);
          
          if (blur > 0) {
            // Use Konva.Image with blur filter for blurred backgrounds
            // Scale image to cover canvas (cover mode)
            const scaleX = stage.width() / img.width;
            const scaleY = stage.height() / img.height;
            const scale = Math.max(scaleX, scaleY);
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;
            
            const bgImage = new Konva.Image({
              id: "canvas-background-image",
              x: (stage.width() - scaledWidth) / 2,
              y: (stage.height() - scaledHeight) / 2,
              width: scaledWidth,
              height: scaledHeight,
              image: img,
              listening: false,
            });
            
            // Apply blur filter
            bgImage.filters([Konva.Filters.Blur]);
            bgImage.blurRadius(blur);
            bgImage.cache();
            
            layer.add(bgImage);
            bgImage.moveToBottom();
          } else {
            // Use fillPatternImage for non-blurred backgrounds (more efficient)
            // Ensure any existing blur image is removed
            const existingBgImage = layer.findOne((node: any) => node.id() === "canvas-background-image");
            if (existingBgImage) {
              existingBgImage.destroy();
            }
            
            bgRect.fillPatternImage(img);
            bgRect.fillPatternRepeat("no-repeat");
            
            const scaleX = stage.width() / img.width;
            const scaleY = stage.height() / img.height;
            bgRect.fillPatternScale({ x: scaleX, y: scaleY });
            bgRect.fillPatternOffset({ x: 0, y: 0 });
            bgRect.fillPriority('pattern');
          }
          
          layer.batchDraw();
          setBackgroundImageUrl(imageUrl);
        }
      } catch (error) {
        console.error("Failed to load background image:", error);
        setBgUploadError("Failed to load background image. Please try again.");
      }
    }
  };

  const handleBackgroundImageUpload = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setBgUploadError(validationError);
      return;
    }

    setBgUploadError(null);
    const url = URL.createObjectURL(file);
    await updateCanvasBackgroundImage(url, backgroundBlur);
    setBackgroundType("image");
    // Note: Blob URLs are not saved to localStorage as they're temporary
  };

  const { getRootProps: getBgRootProps, getInputProps: getBgInputProps, isDragActive: isBgDragActive } = useDropzone({
    onDrop: async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        await handleBackgroundImageUpload(acceptedFiles[0]);
      }
    },
    accept: {
      "image/*": ALLOWED_IMAGE_TYPES.map((type) => type.split("/")[1]),
    },
    maxSize: MAX_IMAGE_SIZE,
    multiple: false,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900">Background Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 sm:space-y-5">
          {/* Background Type Tabs */}
          <div className="flex gap-1 sm:gap-1.5 p-1 bg-gray-50 rounded-lg border border-gray-200">
            <button
              onClick={() => {
                setBackgroundType("solid");
                updateCanvasBackground(backgroundColor);
              }}
              className={`flex-1 px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                backgroundType === "solid"
                  ? "bg-white text-blue-600 shadow-sm border border-blue-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              Solid
            </button>
            <button
              onClick={() => {
                setBackgroundType("gradient");
                updateCanvasGradient(gradientColors, gradientType);
              }}
              className={`flex-1 px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                backgroundType === "gradient"
                  ? "bg-white text-blue-600 shadow-sm border border-blue-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              Gradient
            </button>
            <button
              onClick={() => setBackgroundType("image")}
              className={`flex-1 px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                backgroundType === "image"
                  ? "bg-white text-blue-600 shadow-sm border border-blue-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              Image
            </button>
          </div>

          {/* Solid Color */}
          {backgroundType === "solid" && (
            <div className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Select Color</label>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => {
                      const color = e.target.value;
                      setBackgroundColor(color);
                      updateCanvasBackground(color);
                      setBackgroundType("solid");
                    }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-colors touch-manipulation"
                  />
                  <Input
                    type="text"
                    value={backgroundColor}
                    placeholder="#ffffff"
                    className="flex-1 h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400 font-mono text-base"
                    onChange={(e) => {
                      const color = e.target.value;
                      setBackgroundColor(color);
                      if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
                        updateCanvasBackground(color);
                        setBackgroundType("solid");
                      }
                    }}
                  />
                </div>
              </div>

              {/* Preset Colors */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Preset Colors</label>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                  {[
                    "#ffffff", "#000000", "#f3f4f6", "#ef4444",
                    "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6",
                    "#ec4899", "#06b6d4", "#84cc16", "#f97316",
                  ].map((color) => (
                    <button
                      key={color}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:scale-110 transition-all duration-200 shadow-sm hover:shadow-md touch-manipulation"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        setBackgroundColor(color);
                        updateCanvasBackground(color);
                        setBackgroundType("solid");
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Gradient */}
          {backgroundType === "gradient" && (
            <div className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Gradient Type</label>
                <div className="flex gap-2">
                  <Button
                    variant={gradientType === "linear" ? "default" : "outline"}
                    onClick={() => {
                      setGradientType("linear");
                      updateCanvasGradient(gradientColors, "linear");
                    }}
                    className={`flex-1 h-11 touch-manipulation ${gradientType === "linear" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                  >
                    Linear
                  </Button>
                  <Button
                    variant={gradientType === "radial" ? "default" : "outline"}
                    onClick={() => {
                      setGradientType("radial");
                      updateCanvasGradient(gradientColors, "radial");
                    }}
                    className={`flex-1 h-11 touch-manipulation ${gradientType === "radial" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                  >
                    Radial
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Colors</label>
                {gradientColors.map((color, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Input
                      type="color"
                      value={color}
                      onChange={(e) => {
                        const newColors = [...gradientColors];
                        newColors[index] = e.target.value;
                        setGradientColors(newColors);
                        updateCanvasGradient(newColors, gradientType);
                      }}
                      className="w-16 h-16 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-colors"
                    />
                    <Input
                      type="text"
                      value={color}
                      onChange={(e) => {
                        const newColors = [...gradientColors];
                        newColors[index] = e.target.value;
                        setGradientColors(newColors);
                        if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(e.target.value)) {
                          updateCanvasGradient(newColors, gradientType);
                        }
                      }}
                      className="flex-1 h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400 font-mono"
                      placeholder="#ffffff"
                    />
                    {gradientColors.length > 2 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => {
                          const newColors = gradientColors.filter((_, i) => i !== index);
                          setGradientColors(newColors);
                          updateCanvasGradient(newColors, gradientType);
                        }}
                      >
                        <X size={18} weight="regular" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-200 hover:bg-gray-50"
                  onClick={() => {
                    const newColors = [...gradientColors, "#000000"];
                    setGradientColors(newColors);
                  }}
                >
                  + Add Color
                </Button>
              </div>

              {/* Random Gradient Generator */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Generate Random Gradient</label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 h-11 border-gray-200 hover:bg-gray-50"
                    onClick={() => {
                      // Generate random colors
                      const generateRandomColor = () => {
                        const letters = '0123456789ABCDEF';
                        let color = '#';
                        for (let i = 0; i < 6; i++) {
                          color += letters[Math.floor(Math.random() * 16)];
                        }
                        return color;
                      };
                      
                      const numColors = Math.random() > 0.5 ? 2 : 3; // 2 or 3 colors
                      const randomColors = Array.from({ length: numColors }, () => generateRandomColor());
                      const randomType = Math.random() > 0.5 ? "linear" : "radial";
                      
                      setGradientColors(randomColors);
                      setGradientType(randomType);
                      updateCanvasGradient(randomColors, randomType);
                      setBackgroundType("gradient");
                    }}
                  >
                    Random Gradient
                  </Button>
                </div>
              </div>

              {/* Preset Gradients */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Preset Gradients</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    // Beautiful Linear Gradients - Modern & Elegant
                    { colors: ["#667eea", "#764ba2"], type: "linear" as const, name: "Royal Purple" },
                    { colors: ["#f093fb", "#f5576c"], type: "linear" as const, name: "Pink Passion" },
                    { colors: ["#4facfe", "#00f2fe"], type: "linear" as const, name: "Ocean Breeze" },
                    { colors: ["#43e97b", "#38f9d7"], type: "linear" as const, name: "Mint Fresh" },
                    { colors: ["#fa709a", "#fee140"], type: "linear" as const, name: "Sunset Glow" },
                    { colors: ["#a8edea", "#fed6e3"], type: "linear" as const, name: "Soft Pastel" },
                    { colors: ["#ffecd2", "#fcb69f"], type: "linear" as const, name: "Peach Cream" },
                    { colors: ["#ff9a9e", "#fecfef"], type: "linear" as const, name: "Blush Pink" },
                    { colors: ["#a18cd1", "#fbc2eb"], type: "linear" as const, name: "Lavender Mist" },
                    { colors: ["#fad0c4", "#ffd1ff"], type: "linear" as const, name: "Rose Gold" },
                    { colors: ["#ffeaa7", "#fab1a0"], type: "linear" as const, name: "Warm Sand" },
                    { colors: ["#ff9a56", "#ff6a88"], type: "linear" as const, name: "Coral Reef" },
                    { colors: ["#30cfd0", "#330867"], type: "linear" as const, name: "Deep Ocean" },
                    { colors: ["#a8c0ff", "#3f2b96"], type: "linear" as const, name: "Twilight" },
                    { colors: ["#fbc2eb", "#a6c1ee"], type: "linear" as const, name: "Cotton Candy" },
                    { colors: ["#89f7fe", "#66a6ff"], type: "linear" as const, name: "Sky Blue" },
                    { colors: ["#f6d365", "#fda085"], type: "linear" as const, name: "Golden Hour" },
                    { colors: ["#c471ed", "#f64f59"], type: "linear" as const, name: "Bold Gradient" },
                    { colors: ["#12c2e9", "#c471ed", "#f64f59"], type: "linear" as const, name: "Rainbow" },
                    { colors: ["#0f0c29", "#302b63", "#24243e"], type: "linear" as const, name: "Midnight" },
                    { colors: ["#667eea", "#764ba2", "#f093fb"], type: "linear" as const, name: "Purple Flow" },
                    { colors: ["#ee0979", "#ff6a00"], type: "linear" as const, name: "Hot Gradient" },
                    { colors: ["#00c9ff", "#92fe9d"], type: "linear" as const, name: "Turquoise" },
                    { colors: ["#134e5e", "#71b280"], type: "linear" as const, name: "Forest" },
                    { colors: ["#1e3c72", "#2a5298"], type: "linear" as const, name: "Professional Blue" },
                    { colors: ["#f5af19", "#f12711"], type: "linear" as const, name: "Sunset Fire" },
                    { colors: ["#11998e", "#38ef7d"], type: "linear" as const, name: "Emerald Flow" },
                    { colors: ["#8e2de2", "#4a00e0"], type: "linear" as const, name: "Purple Dream" },
                    // Beautiful Radial Gradients - Modern & Elegant
                    { colors: ["#667eea", "#764ba2"], type: "radial" as const, name: "Royal Purple" },
                    { colors: ["#f093fb", "#f5576c"], type: "radial" as const, name: "Pink Passion" },
                    { colors: ["#4facfe", "#00f2fe"], type: "radial" as const, name: "Ocean Breeze" },
                    { colors: ["#43e97b", "#38f9d7"], type: "radial" as const, name: "Mint Fresh" },
                    { colors: ["#fa709a", "#fee140"], type: "radial" as const, name: "Sunset Glow" },
                    { colors: ["#a8edea", "#fed6e3"], type: "radial" as const, name: "Soft Pastel" },
                    { colors: ["#ffecd2", "#fcb69f"], type: "radial" as const, name: "Peach Cream" },
                    { colors: ["#ff9a9e", "#fecfef"], type: "radial" as const, name: "Blush Pink" },
                    { colors: ["#a18cd1", "#fbc2eb"], type: "radial" as const, name: "Lavender Mist" },
                    { colors: ["#fad0c4", "#ffd1ff"], type: "radial" as const, name: "Rose Gold" },
                    { colors: ["#ffeaa7", "#fab1a0"], type: "radial" as const, name: "Warm Sand" },
                    { colors: ["#ff9a56", "#ff6a88"], type: "radial" as const, name: "Coral Reef" },
                    { colors: ["#30cfd0", "#330867"], type: "radial" as const, name: "Deep Ocean" },
                    { colors: ["#a8c0ff", "#3f2b96"], type: "radial" as const, name: "Twilight" },
                    { colors: ["#fbc2eb", "#a6c1ee"], type: "radial" as const, name: "Cotton Candy" },
                    { colors: ["#89f7fe", "#66a6ff"], type: "radial" as const, name: "Sky Blue" },
                    { colors: ["#f6d365", "#fda085"], type: "radial" as const, name: "Golden Hour" },
                    { colors: ["#c471ed", "#f64f59"], type: "radial" as const, name: "Bold Burst" },
                    { colors: ["#12c2e9", "#c471ed", "#f64f59"], type: "radial" as const, name: "Rainbow" },
                    { colors: ["#0f0c29", "#302b63", "#24243e"], type: "radial" as const, name: "Midnight" },
                    { colors: ["#ee0979", "#ff6a00"], type: "radial" as const, name: "Hot Burst" },
                    { colors: ["#00c9ff", "#92fe9d"], type: "radial" as const, name: "Turquoise" },
                    { colors: ["#134e5e", "#71b280"], type: "radial" as const, name: "Forest" },
                    { colors: ["#1e3c72", "#2a5298"], type: "radial" as const, name: "Professional Blue" },
                    { colors: ["#f5af19", "#f12711"], type: "radial" as const, name: "Sunset Fire" },
                    { colors: ["#11998e", "#38ef7d"], type: "radial" as const, name: "Emerald Flow" },
                    { colors: ["#8e2de2", "#4a00e0"], type: "radial" as const, name: "Purple Dream" },
                  ]
                    .filter(preset => preset.type === gradientType)
                    .map((preset, idx) => (
                    <button
                      key={idx}
                      className="h-14 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:scale-105 transition-all duration-200 relative overflow-hidden shadow-sm hover:shadow-md group"
                      style={{
                        background: preset.type === "radial" 
                          ? `radial-gradient(circle, ${preset.colors.join(", ")})`
                          : `linear-gradient(to right, ${preset.colors.join(", ")})`,
                      }}
                      onClick={() => {
                        setGradientColors(preset.colors);
                        setGradientType(preset.type);
                        updateCanvasGradient(preset.colors, preset.type);
                        setBackgroundType("gradient");
                      }}
                      title={preset.name || `${preset.type} - ${preset.colors.join(" → ")}`}
                    >
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/40 text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity truncate">
                        {preset.name || preset.type}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Background Image */}
          {backgroundType === "image" && (
            <div className="space-y-4">
              {staticBackgrounds.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Preset Backgrounds</label>
                  <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto p-1">
                    {staticBackgrounds.map((publicId, idx) => {
                      // bgPath is always a Cloudinary public ID
                      const thumbnailUrl = getCldImageUrl({
                        src: publicId,
                        width: 300,
                        height: 200,
                        quality: 'auto',
                        format: 'auto',
                        crop: 'fill',
                        gravity: 'auto',
                      });
                      
                      return (
                        <button
                          key={idx}
                          className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 hover:border-2 transition-all group"
                          onClick={() => {
                            updateCanvasBackgroundImage(publicId, backgroundBlur);
                            setBackgroundType("image");
                          }}
                          title={`Use background ${idx + 1}`}
                        >
                          <img
                            src={thumbnailUrl}
                            alt={`Background ${idx + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Upload Background Image</label>
                <div
                  {...getBgRootProps()}
                  className={`border-2 border-dashed rounded-xl p-10 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
                    isBgDragActive
                      ? "border-blue-500 bg-blue-50/50 scale-[1.02]"
                      : "border-gray-200 hover:border-blue-400 hover:bg-gray-50/50"
                  }`}
                >
                  <input {...getBgInputProps()} />
                  <div className={`mb-4 transition-colors flex items-center justify-center w-full ${isBgDragActive ? "text-blue-500" : "text-gray-400"}`}>
                    <ImageIcon size={56} weight="duotone" />
                  </div>
                  {isBgDragActive ? (
                    <p className="text-sm font-medium text-blue-600 text-center">Drop the image here...</p>
                  ) : (
                    <div className="space-y-2 text-center">
                      <p className="text-sm font-semibold text-gray-700">
                        Drag & drop an image here
                      </p>
                      <p className="text-xs text-gray-500">
                        or click to browse • PNG, JPG, WEBP up to {MAX_IMAGE_SIZE / 1024 / 1024}MB
                      </p>
                    </div>
                  )}
                </div>
                {bgUploadError && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                    {bgUploadError}
                  </div>
                )}
              </div>

              {backgroundImageUrl && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Background</label>
                    <div className="relative rounded-lg overflow-hidden border">
                      <img
                        src={
                          backgroundImageUrl.startsWith("blob:") || backgroundImageUrl.startsWith("http")
                            ? backgroundImageUrl
                            : getCldImageUrl({
                                src: backgroundImageUrl,
                                width: 600,
                                height: 200,
                                quality: 'auto',
                                format: 'auto',
                                crop: 'fill',
                                gravity: 'auto',
                              })
                        }
                        alt="Background preview"
                        className="w-full h-32 object-cover"
                        style={{
                          filter: backgroundBlur > 0 ? `blur(${backgroundBlur * 0.1}px)` : 'none'
                        }}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          const bgRect = layer?.findOne((node: any) => node.id() === "canvas-background") as Konva.Rect;
                          const bgImage = layer?.findOne((node: any) => node.id() === "canvas-background-image");
                          if (bgRect && bgRect instanceof Konva.Rect) {
                            bgRect.fillPatternImage(null);
                            bgRect.fill(backgroundColor);
                            if (bgImage) bgImage.destroy();
                            layer?.batchDraw();
                            setBackgroundImageUrl(null);
                            setBackgroundBlur(0);
                            setBackgroundType("solid");
                            updateCanvasBackground(backgroundColor);
                          }
                        }}
                      >
                        <X size={16} weight="regular" className="mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>

                  {/* Blur Control */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-gray-700">Background Blur</label>
                      <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {backgroundBlur}
                      </span>
                    </div>
                    <Slider
                      value={[backgroundBlur]}
                      onValueChange={([value]) => {
                        setBackgroundBlur(value);
                        if (backgroundImageUrl) {
                          updateCanvasBackgroundImage(backgroundImageUrl, value);
                        }
                      }}
                      min={0}
                      max={100}
                      step={1}
                      className="py-2"
                    />
                    <p className="text-xs text-gray-500">
                      Adjust the blur intensity for the background image
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

