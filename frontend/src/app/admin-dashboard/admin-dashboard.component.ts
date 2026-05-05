import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HotelService, Booking } from '../hotel.service';
import { AuthService } from '../auth.service';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  animations: [
    trigger('tableAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.6s 100ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('rowAnim', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateX(-20px)' }),
          stagger('100ms', [
            animate('0.4s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class AdminDashboardComponent implements OnInit {

  bookings: Booking[] = [];
  adminName: string = '';

  constructor(
    private hotelService: HotelService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      this.router.navigate(['/login']);
      return;
    }
    this.adminName = user.username;
    this.fetchBookings();
  }

  fetchBookings() {
    this.hotelService.getAllBookings().subscribe(data => {
      this.bookings = data;
    });
  }

  get totalRevenue(): number {
    return this.bookings.reduce((sum, b) => sum + b.amountPaid, 0);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
