
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'pilgrim', 'cleaner');

-- Create booking status enum
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Create cleaning status enum
CREATE TYPE public.cleaning_status AS ENUM ('pending', 'in_progress', 'completed');

-- Create package tier enum
CREATE TYPE public.package_tier AS ENUM ('basic', 'premium');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'pilgrim',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Destinations table
CREATE TABLE public.destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  location TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  highlights TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Hotels table
CREATE TABLE public.hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'Standard',
  address TEXT DEFAULT '',
  room_types TEXT[] DEFAULT '{}',
  facilities TEXT[] DEFAULT '{}',
  image_url TEXT DEFAULT '',
  map_url TEXT DEFAULT '',
  contact_phone TEXT DEFAULT '',
  contact_email TEXT DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Food plans table
CREATE TABLE public.food_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  meal_type TEXT NOT NULL DEFAULT 'Vegetarian',
  meals_per_day INT NOT NULL DEFAULT 3,
  dining_location TEXT DEFAULT 'Hotel',
  description TEXT DEFAULT '',
  quality_standard TEXT DEFAULT '',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Packages table
CREATE TABLE public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE SET NULL,
  food_plan_id UUID REFERENCES public.food_plans(id) ON DELETE SET NULL,
  tier package_tier NOT NULL DEFAULT 'basic',
  duration_days INT NOT NULL DEFAULT 1,
  group_size TEXT DEFAULT '10-20',
  travel_type TEXT DEFAULT 'Bus',
  travel_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
  accommodation_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
  food_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  highlights TEXT[] DEFAULT '{}',
  itinerary JSONB DEFAULT '[]',
  image_url TEXT DEFAULT '',
  rating NUMERIC(2,1) DEFAULT 4.5,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
  package_name TEXT NOT NULL DEFAULT '',
  tier package_tier NOT NULL DEFAULT 'basic',
  num_travelers INT NOT NULL DEFAULT 1,
  travel_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  travel_details TEXT DEFAULT '',
  hotel_details TEXT DEFAULT '',
  food_details TEXT DEFAULT '',
  status booking_status NOT NULL DEFAULT 'pending',
  payment_status TEXT DEFAULT 'unpaid',
  contact_name TEXT DEFAULT '',
  contact_phone TEXT DEFAULT '',
  contact_email TEXT DEFAULT '',
  special_requests TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cleaners table
CREATE TABLE public.cleaners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cleaning schedules table
CREATE TABLE public.cleaning_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cleaner_id UUID REFERENCES public.cleaners(id) ON DELETE CASCADE NOT NULL,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
  scheduled_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status cleaning_status NOT NULL DEFAULT 'pending',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaning_schedules ENABLE ROW LEVEL SECURITY;

-- Helper function: has_role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper function: is_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'pilgrim');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON public.destinations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hotels_updated_at BEFORE UPDATE ON public.hotels FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_food_plans_updated_at BEFORE UPDATE ON public.food_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON public.packages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cleaners_updated_at BEFORE UPDATE ON public.cleaners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cleaning_schedules_updated_at BEFORE UPDATE ON public.cleaning_schedules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS POLICIES

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Admins can delete profiles" ON public.profiles FOR DELETE USING (public.is_admin());

-- User roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE USING (public.is_admin());

-- Destinations (public read for active, admin full access)
CREATE POLICY "Anyone can view active destinations" ON public.destinations FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins can insert destinations" ON public.destinations FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update destinations" ON public.destinations FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete destinations" ON public.destinations FOR DELETE USING (public.is_admin());

-- Hotels
CREATE POLICY "Anyone can view active hotels" ON public.hotels FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins can insert hotels" ON public.hotels FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update hotels" ON public.hotels FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete hotels" ON public.hotels FOR DELETE USING (public.is_admin());

-- Food plans
CREATE POLICY "Anyone can view food plans" ON public.food_plans FOR SELECT USING (true);
CREATE POLICY "Admins can insert food plans" ON public.food_plans FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update food plans" ON public.food_plans FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete food plans" ON public.food_plans FOR DELETE USING (public.is_admin());

-- Packages
CREATE POLICY "Anyone can view active packages" ON public.packages FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins can insert packages" ON public.packages FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update packages" ON public.packages FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete packages" ON public.packages FOR DELETE USING (public.is_admin());

-- Bookings
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Authenticated users can create bookings" ON public.bookings FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own pending bookings" ON public.bookings FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Users can cancel own bookings" ON public.bookings FOR DELETE USING (user_id = auth.uid() OR public.is_admin());

-- Cleaners
CREATE POLICY "Admins and own cleaners can view" ON public.cleaners FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Admins can insert cleaners" ON public.cleaners FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update cleaners" ON public.cleaners FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete cleaners" ON public.cleaners FOR DELETE USING (public.is_admin());

-- Cleaning schedules
CREATE POLICY "Assigned cleaners and admins can view schedules" ON public.cleaning_schedules FOR SELECT USING (
  public.is_admin() OR EXISTS (
    SELECT 1 FROM public.cleaners WHERE cleaners.id = cleaning_schedules.cleaner_id AND cleaners.user_id = auth.uid()
  )
);
CREATE POLICY "Admins can insert schedules" ON public.cleaning_schedules FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins and assigned cleaners can update schedules" ON public.cleaning_schedules FOR UPDATE USING (
  public.is_admin() OR EXISTS (
    SELECT 1 FROM public.cleaners WHERE cleaners.id = cleaning_schedules.cleaner_id AND cleaners.user_id = auth.uid()
  )
);
CREATE POLICY "Admins can delete schedules" ON public.cleaning_schedules FOR DELETE USING (public.is_admin());
