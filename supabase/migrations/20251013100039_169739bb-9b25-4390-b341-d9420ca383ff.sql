-- Update bookings table for route-based system

-- Step 1: Drop the plan_duration column
ALTER TABLE public.bookings DROP COLUMN plan_duration;

-- Step 2: Rename booth_id to pickup_booth_id  
ALTER TABLE public.bookings RENAME COLUMN booth_id TO pickup_booth_id;

-- Step 3: Add drop_booth_id column as nullable first
ALTER TABLE public.bookings ADD COLUMN drop_booth_id uuid;

-- Step 4: Update existing bookings to have the same booth as pickup and drop (temporary fix for existing data)
UPDATE public.bookings SET drop_booth_id = pickup_booth_id WHERE drop_booth_id IS NULL;

-- Step 5: Make drop_booth_id NOT NULL
ALTER TABLE public.bookings ALTER COLUMN drop_booth_id SET NOT NULL;

-- Step 6: Add foreign key constraint
ALTER TABLE public.bookings ADD CONSTRAINT bookings_drop_booth_id_fkey 
  FOREIGN KEY (drop_booth_id) REFERENCES public.booths(id);

-- Add a comment to clarify the pricing model
COMMENT ON COLUMN public.bookings.price IS 'Price calculated based on distance between pickup and drop booths';