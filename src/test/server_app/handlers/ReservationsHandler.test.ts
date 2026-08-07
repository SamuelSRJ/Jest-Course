import { IncomingMessage, ServerResponse } from "node:http";
import { ReservationsHandler } from "../../../app/server_app/handlers/ReservationsHandler";
import { getRequestBody } from "../../../app/server_app/utils/Utils";
import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { Reservation } from "../../../app/server_app/model/ReservationModel";
import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess";
import { HTTP_CODES, HTTP_METHODS } from "../../../app/server_app/model/ServerModel";



const mockGetRequestBody = jest.fn();
jest.mock('../../../app/server_app/utils/Utils', () => ({
  getRequestBody: () => mockGetRequestBody()
}));

describe('ReservationsHandler test suite', () => {

  let sut: ReservationsHandler;

  const request = {
    method: '',
    headers: {
      authorization: ''
    },
    url: ''
  };

  const mockResponse = {
    writeHead: jest.fn(),
    write: jest.fn(),
    statusCode: 0
  };

  const mockAuthorizer = {
    registerUser: jest.fn(),
    validateToken: jest.fn()
  }

  const mockReservationsDataAccess = {
    createReservation: jest.fn(),
    getAllReservations: jest.fn(),
    getReservation: jest.fn(),
    updateReservation: jest.fn(),
    deleteReservation: jest.fn()
  }

  const someReservation: Reservation = {
    id: '',
    endDate: new Date().toDateString(),
    startDate: new Date().toDateString(),
    room: 'someRoom',
    user: 'someUser'
  }

  const someReservationId = '1234';

  beforeEach(() => {
    sut = new ReservationsHandler(
      request as IncomingMessage,
      mockResponse as any as ServerResponse,
      mockAuthorizer as any as Authorizer,
      mockReservationsDataAccess as any as ReservationsDataAccess
    );
    request.headers.authorization = 'abcd';
    mockAuthorizer.validateToken.mockResolvedValueOnce(true);
  })

  afterEach(() => {
    jest.clearAllMocks();
    request.url = '';
    mockResponse.statusCode = 0;
  })

  describe('POST requests', () => {

    beforeEach(() => {
      request.method = HTTP_METHODS.POST;
    })

    it('Should create reservation from valid request', async () => {
      mockGetRequestBody.mockResolvedValueOnce(someReservation);
      mockReservationsDataAccess.createReservation.mockResolvedValueOnce(someReservationId);

      await sut.handleRequest();

      expect(mockResponse.statusCode).toBe(HTTP_CODES.CREATED);
      expect(mockResponse.writeHead).toHaveBeenCalledWith(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' });
      expect(mockResponse.write).toHaveBeenCalledWith(JSON.stringify({ reservationId: someReservationId }))
    })

    it('Should not create reservation from invalid request', async () => {
      mockGetRequestBody.mockResolvedValueOnce({});

      await sut.handleRequest();

      expect(mockResponse.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(mockResponse.write).toHaveBeenCalledWith(JSON.stringify('Incomplete reservation!'))
    })

    it('Should not create reservation from invalid fields in request', async () => {
      const moreThanAReservation = { ...someReservation, someField: '123' }
      mockGetRequestBody.mockResolvedValueOnce(moreThanAReservation);

      await sut.handleRequest();

      expect(mockResponse.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(mockResponse.write).toHaveBeenCalledWith(JSON.stringify('Incomplete reservation!'))
    })

  });

  describe('GET requests', () => {

    beforeEach(() => {
      request.method = HTTP_METHODS.GET;
    })

    it('Should return all reservation for /all request', async () => {
      request.url = '/reservation/all';
      mockReservationsDataAccess.getAllReservations.mockResolvedValueOnce([someReservation]);

      await sut.handleRequest();

      expect(mockResponse.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
      expect(mockResponse.write).toHaveBeenCalledWith(JSON.stringify([someReservation]));
    })

    it('Should return reservation for existing Id', async () => {
      request.url = `/reservations/${someReservationId}`;
      mockReservationsDataAccess.getReservation.mockResolvedValueOnce(someReservation);

      await sut.handleRequest();

      expect(mockResponse.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
      expect(mockResponse.write).toHaveBeenCalledWith(JSON.stringify(someReservation));
    });

    it('Should return not found for non existing Id', async () => {
      request.url = `/reservations/${someReservationId}`;
      mockReservationsDataAccess.getReservation.mockResolvedValueOnce(undefined);

      await sut.handleRequest();

      expect(mockResponse.statusCode).toBe(HTTP_CODES.NOT_fOUND);
      expect(mockResponse.write).toHaveBeenCalledWith(JSON.stringify(`Reservation with id ${someReservationId} not found`))
    });

    it('', async () => {
      request.url = '/reservations';

      await sut.handleRequest();

      expect(mockResponse.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(mockResponse.write).toHaveBeenCalledWith(JSON.stringify('Please provide an ID!'));
    })

  })

  describe('PUT requests', () => {

    beforeEach(() => {
      request.method = HTTP_METHODS.PUT;
    })

    it('Should return not found for non existing id', async () => {
      request.url = `/reservations/${someReservationId}`;
      mockReservationsDataAccess.getReservation.mockResolvedValueOnce(undefined);

      await sut.handleRequest();

      expect(mockResponse.statusCode).toBe(HTTP_CODES.NOT_fOUND)
      expect(mockResponse.write).toHaveBeenCalledWith(JSON.stringify(`Reservation with id ${someReservationId} not found`))
    })

    it('Should return bad request if no id provided', async () => {
      request.url = '/reservations';

      await sut.handleRequest();

      expect(mockResponse.statusCode).toBe(HTTP_CODES.BAD_REQUEST)
      expect(mockResponse.write).toHaveBeenCalledWith(JSON.stringify('Please provide an ID!'));
    })

    it('Should return bad request if invalid fields are provided', async () => {
      request.url = `/reservations/${someReservationId}`;
      mockReservationsDataAccess.getReservation.mockResolvedValueOnce(someReservation);
      mockGetRequestBody.mockResolvedValueOnce({ startDate1: 'someDate'})

      await sut.handleRequest();

      expect(mockResponse.statusCode).toBe(HTTP_CODES.BAD_REQUEST)
      expect(mockResponse.write).toHaveBeenCalledWith(JSON.stringify('Please provide valid fields to update!'));
    })

    it('Should return bad request if no fields are provided', async () => {
      request.url = `/reservations/${someReservationId}`;
      mockReservationsDataAccess.getReservation.mockResolvedValueOnce(someReservation);
      mockGetRequestBody.mockResolvedValueOnce({});

      await sut.handleRequest();

      expect(mockResponse.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(mockResponse.write).toHaveBeenCalledWith(JSON.stringify('Please provide valid fields to update!'));
    })

    it('Should update reservation with all fields provided', async () => {
      request.url = `/reservations/${someReservationId}`;
      mockReservationsDataAccess.getReservation.mockResolvedValueOnce(someReservation);
      const updateObject = {
        startDate: 'someDate1',
        endDate: 'someDate2'
      }
      mockGetRequestBody.mockResolvedValueOnce(updateObject);

      await sut.handleRequest();

      expect(mockReservationsDataAccess.updateReservation).toHaveBeenCalledTimes(2);
      expect(mockReservationsDataAccess.updateReservation).toHaveBeenCalledWith(
        someReservationId,
        'startDate',
        updateObject.startDate
      );
      expect(mockReservationsDataAccess.updateReservation).toHaveBeenCalledWith(
        someReservationId,
        'endDate',
        updateObject.endDate
      );
      expect(mockResponse.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
      expect(mockResponse.write).toHaveBeenCalledWith(JSON.stringify(
        `Updated ${Object.keys(updateObject)} of reservation ${someReservationId}`
      ));
    })

  })

  describe('DELETE requests', () => {

    beforeEach(() => {
      request.method = HTTP_METHODS.DELETE;
    });

    it('Should delete reservation with provided id', async () => {
      request.url = `/reservations/${someReservationId}`;

      await sut.handleRequest();

      expect(mockReservationsDataAccess.deleteReservation).toHaveBeenCalledWith(someReservationId);
      expect(mockResponse.statusCode).toBe(HTTP_CODES.OK);
      expect(mockResponse.write).toHaveBeenCalledWith(JSON.stringify(
        `Deleted reservation with id ${someReservationId}`
      ));
    })

    it('Should return bad request if no id provided', async () => {
      request.url = '/reservations';

      await sut.handleRequest();

      expect(mockResponse.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(mockResponse.write).toHaveBeenCalledWith(JSON.stringify(
        'Please provide an ID!'
      ));
    });

    it('Should return nothing for not authorized requests', async () => {
      request.headers.authorization = '1234';
      mockAuthorizer.validateToken.mockReset();
      mockAuthorizer.validateToken.mockResolvedValueOnce(false);

      await sut.handleRequest();

      expect(mockResponse.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
      expect(mockResponse.write).toHaveBeenCalledWith(JSON.stringify(
        'Unauthorized operation!'
      ));
    })

    it('Should return nothing if no authorization header is present', async () => {
      request.headers.authorization = '';

      await sut.handleRequest();

      expect(mockResponse.statusCode).toBe(HTTP_CODES.UNAUTHORIZED)
      expect(mockResponse.write).toHaveBeenCalledWith(JSON.stringify(
        'Unauthorized operation!'
      ));
    });

    it('Should do nothing for not supported http methods', async () => {
      request.method = 'SOME-METHOD'

      await sut.handleRequest();

      expect(mockResponse.write).not.toHaveBeenCalled();
      expect(mockResponse.writeHead).not.toHaveBeenCalled();
    })

  })

})