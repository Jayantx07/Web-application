import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

export interface Hotel {
  id: number;
  name: string;
  price: number;
  image: string;
  bookedDates: string[]; // YYYY-MM-DD
}

export interface Booking {
  hotelName: string;
  reservedDate: string;
  reservedForUser: string;
  amountPaid: number;
}

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  private hotels: Hotel[] = [
    { id: 1, name: 'The Grand SWTech Hotel', price: 299, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', bookedDates: ['2026-05-06', '2026-05-07'] },
    { id: 2, name: 'Luxury Seaside Resort', price: 450, image: 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', bookedDates: ['2026-05-08'] },
    { id: 3, name: 'Urban Chic Boutique', price: 150, image: 'https://www.orchidhotel.com/static/website/images/chandigarh/home-page/slider/slider2.webp', bookedDates: [] }
  ];

  private bookings: Booking[] = [
    { hotelName: 'The Grand SWTech Hotel', reservedDate: '2026-05-06', reservedForUser: 'JohnDoe', amountPaid: 299 }
  ];

  constructor() { }

  getHotels(): Observable<Hotel[]> {
    return of(this.hotels).pipe(delay(500));
  }

  bookHotel(hotel: Hotel, date: string, username: string): Observable<{success: boolean, message: string}> {
    if (hotel.bookedDates.includes(date)) {
        return of({ success: false, message: 'Please try again!!' }).pipe(delay(800));
    }
    
    // Success scenario
    hotel.bookedDates.push(date);
    this.bookings.push({
      hotelName: hotel.name,
      reservedDate: date,
      reservedForUser: username,
      amountPaid: hotel.price
    });

    return of({ success: true, message: `Your booking for the Hotel ${hotel.name} is successful` }).pipe(delay(800));
  }

  getAllBookings(): Observable<Booking[]> {
    return of(this.bookings).pipe(delay(500));
  }
}
