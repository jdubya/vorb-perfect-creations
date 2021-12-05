import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Airtable, { Base } from 'airtable';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export interface Order {
  order_id: number;
  order_placed: string;
  product_name: string;
  price: number;
  first_name: string;
  last_name: string;
  address: string;
  email: string;
  order_status: string;
}

@Injectable()
export class AirtableService {
  constructor(private configService: ConfigService) {}

  async getStats() {
    const allOrders = await this.getAllOrders();

    // Note: no orders for this month or last so pretended to be in October
    // const thisYearAndMonth = dayjs.utc().format('YYYY-MM');
    // const lastYearAndMonth = dayjs.utc().subtract(1, 'month').format('YYYY-MM');
    const thisYearAndMonth = '2021-10';
    const lastYearAndMonth = '2021-09';

    const ordersThisMonth = this.getOrderCountForYearAndMonth(
      allOrders,
      thisYearAndMonth,
    );
    const ordersLastMonth = this.getOrderCountForYearAndMonth(
      allOrders,
      lastYearAndMonth,
    );
    const ordersTotal = allOrders.length;

    const revenueThisMonth = this.getRevenueSumForYearAndMonth(
      allOrders,
      thisYearAndMonth,
    );
    const revenueLastMonth = this.getRevenueSumForYearAndMonth(
      allOrders,
      lastYearAndMonth,
    );
    const revenueTotal = this.getRevenueTotal(allOrders);

    const ordersInProgress = this.getOrdersInProgressCount(allOrders);
    const mostRecent = allOrders.slice(0, 5);

    return {
      ordersThisMonth,
      ordersLastMonth,
      ordersTotal,
      revenueThisMonth,
      revenueLastMonth,
      revenueTotal,
      ordersInProgress,
      mostRecent,
    };
  }

  private getOrderCountForYearAndMonth(orders: Order[], yearAndMonth: string) {
    return orders.reduce((prev, curr) => {
      return curr.order_placed.substr(0, 7) === yearAndMonth
        ? (prev += 1)
        : prev;
    }, 0);
  }

  private getRevenueSumForYearAndMonth(orders: Order[], yearAndMonth: string) {
    const revenue = orders.reduce((prev, curr) => {
      return curr.order_placed.substr(0, 7) === yearAndMonth
        ? (prev += curr.price)
        : prev;
    }, 0);
    return Math.round(revenue * 100) / 100;
  }

  private getRevenueTotal(orders: Order[]) {
    const revenue = orders.reduce((prev, curr) => (prev += curr.price), 0);
    return Math.round(revenue * 100) / 100;
  }

  private getOrdersInProgressCount(orders: Order[]) {
    return orders.reduce((prev, curr) => {
      return curr.order_status === 'in_progress' ? (prev += 1) : prev;
    }, 0);
  }

  private getAllOrders(): Promise<Order[]> {
    return new Promise((resolve, reject) => {
      const apiKey = this.configService.get<string>('AIRTABLE_API_KEY');
      const baseId = this.configService.get<string>('AIRTABLE_BASE_ID');

      const base: Base = new Airtable({ apiKey }).base(baseId);

      const orders: Order[] = [];

      // called for every page of records
      const processPage = (partialRecords, fetchNextPage) => {
        partialRecords.forEach(function (record) {
          orders.push(record.fields);
        });

        fetchNextPage();
      };

      // called when all the records have been retrieved
      const processRecords = (err) => {
        if (err) {
          reject(err);
        }
        resolve(orders);
      };

      base('Orders')
        .select({
          view: 'Grid view',
          sort: [{ field: 'order_placed', direction: 'desc' }],
        })
        .eachPage(processPage, processRecords);
    });
  }
}
