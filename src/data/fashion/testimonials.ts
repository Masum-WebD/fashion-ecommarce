// ────────────────────────────────────────────────────────────────────────────
// STATIC TESTIMONIALS DATA
// ────────────────────────────────────────────────────────────────────────────

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  avatar?: string;
  rating: number;
  text: string;
  product?: string;
}

export const staticTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Ayesha Rahman",
    location: "Dhaka",
    rating: 5,
    text: "The quality is absolutely stunning! The Floral Wrap Midi Dress fits perfectly and the fabric is incredibly soft. I received so many compliments at the wedding.",
    product: "Floral Wrap Midi Dress",
  },
  {
    id: 2,
    name: "Farhan Hossain",
    location: "Chittagong",
    rating: 5,
    text: "Finally found a brand that understands modern menswear. The Oxford button-down is my new office staple. Delivery was fast and packaging was premium.",
    product: "Classic Oxford Button-Down",
  },
  {
    id: 3,
    name: "Nadia Islam",
    location: "Sylhet",
    rating: 5,
    text: "I was skeptical about online shopping for clothes but Velura Fashion changed my mind. The size guide was accurate and returns were hassle-free. A loyal customer now!",
    product: "Premium Linen Blazer",
  },
  {
    id: 4,
    name: "Tanvir Ahmed",
    location: "Rajshahi",
    rating: 4,
    text: "Great quality for the price. The Merino Wool Crewneck is warm yet breathable. Would have given 5 stars if delivery was a day earlier but overall very satisfied.",
    product: "Merino Wool Crewneck",
  },
];
