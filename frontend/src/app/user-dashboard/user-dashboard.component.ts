import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HotelService, Hotel } from '../hotel.service';
import { AuthService } from '../auth.service';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';

export interface DisplayHotel extends Hotel {
  selectedDate?: string;
}

@Component({
//... skipped some lines
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger('100ms', [
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('messageFade', [
       transition(':enter', [
          style({ opacity: 0, transform: 'translateY(-20px)' }),
          animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
       ]),
       transition(':leave', [
          animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
       ])
    ])
  ]
})
export class UserDashboardComponent implements OnInit {

  hotels: DisplayHotel[] = [];
  username: string = '';
  bookingMessage: string | null = null;
  bookingSuccess: boolean = true;
  

  weekDates: { date: Date, dateString: string, display: string }[] = [];

  constructor(
    private hotelService: HotelService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (!user || user.role !== 'USER') {
      this.router.navigate(['/login']);
      return;
    }
    this.username = user.username;
    this.generateCalendar();
    this.fetchHotels();
  }

  generateCalendar() {
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date();
      nextDate.setDate(today.getDate() + i);
      const yyyy = nextDate.getFullYear();
      const mm = String(nextDate.getMonth() + 1).padStart(2, '0');
      const dd = String(nextDate.getDate()).padStart(2, '0');
      
      this.weekDates.push({
        date: nextDate,
        dateString: `${yyyy}-${mm}-${dd}`,
        display: nextDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      });
    }
  }

  fetchHotels() {
    this.hotelService.getHotels().subscribe(data => {
      this.hotels = data.map(h => ({...h, selectedDate: ''} as any));
    });
  }

  selectDate(hotel: any, targetDateString: string) {
    if (this.isBooked(hotel, targetDateString)) return;
    hotel.selectedDate = targetDateString;
  }

  isBooked(hotel: Hotel, dateString: string): boolean {
    return hotel.bookedDates.includes(dateString);
  }

  book(hotel: any) {
    if (!hotel.selectedDate) return;
    
    this.hotelService.bookHotel(hotel, hotel.selectedDate, this.username).subscribe(res => {
      this.bookingSuccess = res.success;
      this.bookingMessage = res.message;
      
      if (res.success) {
        this.fetchHotels();
      }

      setTimeout(() => {
        this.bookingMessage = null;
      }, 4000);
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}