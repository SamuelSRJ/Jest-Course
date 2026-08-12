import { DataBase } from "../../app/server_app/data/DataBase";
import { Reservation } from "../../app/server_app/model/ReservationModel";
import { HTTP_CODES, HTTP_METHODS } from "../../app/server_app/model/ServerModel";
import { Server } from "../../app/server_app/server/Server";
import { RequestTestWrapper } from "./test_utils/RequestTestWrappers";
import { ResponseTestWrapper } from "./test_utils/ResponseTestWrapper";



jest.mock('../../app/server_app/data/DataBase');

const mockRequestWrapper = new RequestTestWrapper();
const mockResponseWrapper = new ResponseTestWrapper();

const fakeServer = {
  listen: () => {},
  close: () => {}
};

jest.mock('http', () => ({
  createServer: (cb: any) => {
    cb(mockRequestWrapper, mockResponseWrapper)
    return fakeServer;
  }
}))

const someReservation: Reservation = {
  id: '',
  endDate: 'someEndDate',
  startDate: 'someStartDate',
  room: 'someRoom',
  user: 'someUser'
}

const someId = 'someId';

const jsonHeader = { 'Content-Type': 'application/json' }

describe('Reservation requests', () => {
  const insertSpy = jest.spyOn(DataBase.prototype, 'insert');
  const getBySpy = jest.spyOn(DataBase.prototype, 'getBy');
  const getAllElementsSpy = jest.spyOn(DataBase.prototype, 'getAllElements');
  const updateSpy = jest.spyOn(DataBase.prototype, 'update');
  const deleteSpy = jest.spyOn(DataBase.prototype, 'delete');

  beforeEach(() => {
    mockRequestWrapper.headers['user-agent'] = 'jest tests'
    mockRequestWrapper.headers['authorization'] = 'someToken'
    // Authenticate calls:
    getBySpy.mockResolvedValueOnce({
      valid: true
    })
  })

  afterEach(() => {
    mockRequestWrapper.clearFields();
    mockResponseWrapper.clearFields();
    jest.clearAllMocks();
  })

  describe('POST Requests', () => {

    it('Should create reservation from valid request', async () => {
      mockRequestWrapper.method = HTTP_METHODS.POST;
      mockRequestWrapper.body = someReservation;
      mockRequestWrapper.url = 'localhost:8080/reservation';
      insertSpy.mockResolvedValue(someId);

      await new Server().startServer();

      await new Promise(process.nextTick); // This solves timing issues

      expect(mockResponseWrapper.statusCode).toBe(HTTP_CODES.CREATED);
      expect(mockResponseWrapper.body).toEqual({
        reservationId: someId
      })
      expect(mockResponseWrapper.headers).toContainEqual(jsonHeader);
    });

    it('Should not create reservation from invalid request', async () => {
      mockRequestWrapper.method = HTTP_METHODS.POST;
      mockRequestWrapper.body = {};
      mockRequestWrapper.url = 'localhost:8080/reservation';

      await new Server().startServer();

      await new Promise(process.nextTick); // This solves timing issues

      expect(mockResponseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(mockResponseWrapper.body).toEqual('Incomplete reservation!')
    });

  })

  describe('GET request', () => {

    it('Should return all reservations', async () => {
      mockRequestWrapper.method = HTTP_METHODS.GET;
      mockRequestWrapper.url = 'localhost:8080/reservation/all';
      getAllElementsSpy.mockResolvedValueOnce([someReservation, someReservation])

      await new Server().startServer();

      await new Promise(process.nextTick); // This solves timing issues

      expect(mockResponseWrapper.statusCode).toBe(HTTP_CODES.OK);
      expect(mockResponseWrapper.body).toEqual([someReservation, someReservation])
      expect(mockResponseWrapper.headers).toContainEqual(jsonHeader);
    });

    it('Should return specific reservations', async () => {
      mockRequestWrapper.method = HTTP_METHODS.GET;
      mockRequestWrapper.url = `localhost:8080/reservation/${someId}`;
      getBySpy.mockResolvedValueOnce(someReservation);

      await new Server().startServer();

      await new Promise(process.nextTick); // This solves timing issues

      expect(mockResponseWrapper.statusCode).toBe(HTTP_CODES.OK);
      expect(mockResponseWrapper.body).toEqual(someReservation)
      expect(mockResponseWrapper.headers).toContainEqual(jsonHeader);
    });

    it('Should return not found if reservation is not found', async () => {
      mockRequestWrapper.method = HTTP_METHODS.GET;
      mockRequestWrapper.url = `localhost:8080/reservation/${someId}`;
      getBySpy.mockResolvedValueOnce(undefined);

      await new Server().startServer();

      await new Promise(process.nextTick); // This solves timing issues

      expect(mockResponseWrapper.statusCode).toBe(HTTP_CODES.NOT_fOUND);
      expect(mockResponseWrapper.body).toEqual(`Reservation with id ${someId} not found`)
    });

    it('Should return bad request if reservation is not provided', async () => {
      mockRequestWrapper.method = HTTP_METHODS.GET;
      mockRequestWrapper.url = `localhost:8080/reservation`;

      await new Server().startServer();

      await new Promise(process.nextTick); // This solves timing issues

      expect(mockResponseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(mockResponseWrapper.body).toEqual(`Please provide an ID!`)
    });

  })

  describe('PUT requests', () => {

    it('Should update reservation if found and valid request', async () => {
      mockRequestWrapper.method = HTTP_METHODS.PUT;
      mockRequestWrapper.url = `localhost:8080/reservation/${someId}`;
      getBySpy.mockResolvedValueOnce(someReservation);
      updateSpy.mockResolvedValue(undefined);
      mockRequestWrapper.body = {
        user: 'someOtherUser',
        startDate: 'someOtherStartDate'
      }

      await new Server().startServer();

      await new Promise(process.nextTick); // This solves timing issues

      expect(mockResponseWrapper.statusCode).toBe(HTTP_CODES.OK);
      expect(mockResponseWrapper.body).toEqual(
        `Updated user,startDate of reservation ${someId}`
      )
      expect(mockResponseWrapper.headers).toContainEqual(jsonHeader);
    });

    it('Should not update reservation if invalid fields are provided', async () => {
      mockRequestWrapper.method = HTTP_METHODS.PUT;
      mockRequestWrapper.url = `localhost:8080/reservation/${someId}`;
      getBySpy.mockResolvedValueOnce(someReservation);
      updateSpy.mockResolvedValue(undefined);
      mockRequestWrapper.body = {
        user: 'someOtherUser',
        startDate: 'someOtherStartDate',
        someOtherField: 'someOtherField'
      }

      await new Server().startServer();

      await new Promise(process.nextTick); // This solves timing issues

      expect(mockResponseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(mockResponseWrapper.body).toEqual('Please provide valid fields to update!')
    });

    it('Should not update reservation if it is not found', async () => {
      mockRequestWrapper.method = HTTP_METHODS.PUT;
      mockRequestWrapper.url = `localhost:8080/reservation/${someId}`;
      updateSpy.mockResolvedValue(undefined);

      await new Server().startServer();

      await new Promise(process.nextTick); // This solves timing issues

      expect(mockResponseWrapper.statusCode).toBe(HTTP_CODES.NOT_fOUND);
      expect(mockResponseWrapper.body).toEqual(`Reservation with id ${someId} not found`)
    });

    it('Should return bad request if no reservation id is provided', async () => {
      mockRequestWrapper.method = HTTP_METHODS.PUT;
      mockRequestWrapper.url = `localhost:8080/reservation/`;
      updateSpy.mockResolvedValue(undefined);

      await new Server().startServer();

      await new Promise(process.nextTick); // This solves timing issues

      expect(mockResponseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(mockResponseWrapper.body).toEqual(`Please provide an ID!`)
    });

  })

  describe('DELETE requests', () => {

    it('Should delete specific reservations', async () => {
      mockRequestWrapper.method = HTTP_METHODS.DELETE;
      mockRequestWrapper.url = `localhost:8080/reservation/${someId}`;
      deleteSpy.mockResolvedValueOnce(undefined)

      await new Server().startServer();

      await new Promise(process.nextTick); // This solves timing issues

      expect(mockResponseWrapper.statusCode).toBe(HTTP_CODES.OK);
      expect(mockResponseWrapper.body).toEqual(`Deleted reservation with id ${someId}`);
    });

    it('Should return bad request if no reservation id is provided', async () => {
      mockRequestWrapper.method = HTTP_METHODS.DELETE;
      mockRequestWrapper.url = `localhost:8080/reservation/`;

      await new Server().startServer();

      await new Promise(process.nextTick); // This solves timing issues

      expect(mockResponseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(mockResponseWrapper.body).toEqual(`Please provide an ID!`);
    });

  })

  it('Should do nothing for not supported methods', async () => {
      mockRequestWrapper.method = HTTP_METHODS.OPTIONS;
      mockRequestWrapper.body = {};
      mockRequestWrapper.url = 'localhost:8080/reservation';

      await new Server().startServer();

      await new Promise(process.nextTick); // This solves timing issues

      expect(mockResponseWrapper.statusCode).toBeUndefined();
      expect(mockResponseWrapper.headers).toHaveLength(0);
      expect(mockResponseWrapper.body).toBeUndefined();
    });

    it('Should return not authorized if request is not authorized', async () => {
      mockRequestWrapper.method = HTTP_METHODS.POST;
      mockResponseWrapper.body = {};
      mockRequestWrapper.url = 'localhost:8080/reservation';
      getBySpy.mockReset();
      getBySpy.mockResolvedValueOnce(undefined);

      await new Server().startServer();

      await new Promise(process.nextTick); // This solves timing issues

      expect(mockResponseWrapper.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
      expect(mockResponseWrapper.body).toEqual('Unauthorized operation!');
    });

})