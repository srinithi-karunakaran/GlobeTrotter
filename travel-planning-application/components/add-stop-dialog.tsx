"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MapPin, Check, ChevronsUpDown } from "lucide-react"
import { getAllCities, addTripStop, type City } from "@/lib/itinerary"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface AddStopDialogProps {
  tripId: number
  onStopAdded: () => void
  children?: React.ReactNode
}

export function AddStopDialog({ tripId, onStopAdded, children }: AddStopDialogProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [cities, setCities] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [formData, setFormData] = useState({
    arrivalDate: "",
    departureDate: "",
    notes: "",
  })

  useEffect(() => {
    const loadCities = async () => {
      const allCities = await getAllCities()
      setCities(allCities)
    }
    loadCities()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCity) {
      toast({
        title: "Error",
        description: "Please select a city",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const stop = await addTripStop(
        tripId,
        selectedCity.id,
        formData.arrivalDate,
        formData.departureDate,
        formData.notes,
      )

      if (stop) {
        toast({
          title: "Stop added!",
          description: `${selectedCity.name} has been added to your trip`,
        })
        setOpen(false)
        setSelectedCity(null)
        setFormData({ arrivalDate: "", departureDate: "", notes: "" })
        onStopAdded()
      } else {
        toast({
          title: "Error",
          description: "Failed to add stop",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <MapPin className="h-4 w-4 mr-2" />
            Add Stop
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add City to Itinerary</DialogTitle>
            <DialogDescription>Select a city and specify when you'll be there</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>City *</Label>
              <Popover open={cityOpen} onOpenChange={setCityOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={cityOpen}
                    className="w-full justify-between bg-transparent"
                  >
                    {selectedCity ? `${selectedCity.name}, ${selectedCity.country}` : "Select city..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput placeholder="Search cities..." />
                    <CommandList>
                      <CommandEmpty>No city found.</CommandEmpty>
                      <CommandGroup>
                        {cities.map((city) => (
                          <CommandItem
                            key={city.id}
                            value={`${city.name} ${city.country}`}
                            onSelect={() => {
                              setSelectedCity(city)
                              setCityOpen(false)
                            }}
                          >
                            <Check
                              className={cn("mr-2 h-4 w-4", selectedCity?.id === city.id ? "opacity-100" : "opacity-0")}
                            />
                            {city.name}, {city.country}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="arrivalDate">Arrival Date *</Label>
                <Input
                  id="arrivalDate"
                  type="date"
                  value={formData.arrivalDate}
                  onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="departureDate">Departure Date *</Label>
                <Input
                  id="departureDate"
                  type="date"
                  value={formData.departureDate}
                  onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                  min={formData.arrivalDate}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input
                id="notes"
                placeholder="Any special plans for this city?"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Stop"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
