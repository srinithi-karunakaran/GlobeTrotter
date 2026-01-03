"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Share2, Copy, Check } from "lucide-react"
import { updateTrip } from "@/lib/trips"
import { generateShareUrl, copyToClipboard } from "@/lib/sharing"
import { useToast } from "@/hooks/use-toast"

interface ShareTripDialogProps {
  tripId: number
  isPublic: boolean
  onUpdate: () => void
}

export function ShareTripDialog({ tripId, isPublic, onUpdate }: ShareTripDialogProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isPublicTrip, setIsPublicTrip] = useState(isPublic)
  const [copied, setCopied] = useState(false)
  const shareUrl = generateShareUrl(tripId)

  const handleTogglePublic = async (checked: boolean) => {
    const success = await updateTrip(tripId, { is_public: checked ? 1 : 0 })

    if (success) {
      setIsPublicTrip(checked)
      toast({
        title: checked ? "Trip is now public" : "Trip is now private",
        description: checked ? "Anyone with the link can view your trip" : "Only you can view your trip",
      })
      onUpdate()
    } else {
      toast({
        title: "Error",
        description: "Failed to update trip visibility",
        variant: "destructive",
      })
    }
  }

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl)

    if (success) {
      setCopied(true)
      toast({
        title: "Link copied!",
        description: "Share this link with others",
      })
      setTimeout(() => setCopied(false), 2000)
    } else {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-transparent">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share Your Trip</DialogTitle>
          <DialogDescription>Make your trip public and share the link with others</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="public">Public Trip</Label>
              <p className="text-sm text-muted-foreground">Allow anyone with the link to view your trip</p>
            </div>
            <Switch id="public" checked={isPublicTrip} onCheckedChange={handleTogglePublic} />
          </div>

          {isPublicTrip && (
            <div className="space-y-2">
              <Label>Share Link</Label>
              <div className="flex gap-2">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button onClick={handleCopyLink} size="icon" variant="outline">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Anyone with this link can view your trip itinerary</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
