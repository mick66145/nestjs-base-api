import { IncomingMessage } from 'http';
import * as http from 'http';
import * as https from 'https';
import QueryString from 'qs';

export const apiHandle = async function (
  params: {
    host: string;
    port?: number;
    path: string;
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    query?: {
      params: Record<string, string | number | string[] | number[]>;
      options?: QueryString.IStringifyOptions<QueryString.BooleanOptional>;
    };
    useProtocol?: 'http' | 'https';
  },
  data?: object,
): Promise<{ data: Buffer; response: IncomingMessage }> {
  const { path, port, method, headers, query, useProtocol = 'https' } = params;
  const host = String(params.host).replace(/(http)s?:\/\//, '');

  const { params: queryParams, options: queryOptions } = query ?? {};
  const queryString = QueryString.stringify(queryParams, queryOptions);

  const request = useProtocol === 'https' ? https.request : http.request;

  return new Promise((resolve, reject) => {
    const bufferArray: Buffer[] = [];
    const httpRequest = request(
      {
        host,
        port,
        path: `${path}?${queryString}`,
        method,
        headers: Object.assign(
          {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          headers,
        ),
      },
      (response) => {
        response.on('data', (d) => {
          bufferArray.push(d);
        });

        response.on('end', () => {
          resolve({
            data: Buffer.concat(bufferArray),
            response,
          });
        });
      },
    );

    httpRequest.on('error', (error) => {
      reject(error);
    });

    // 判斷型態寫入不同資料
    if (httpRequest.getHeader('Content-Type') === 'application/json') {
      httpRequest.write(JSON.stringify(data ?? {}));
    } else {
      httpRequest.write(new URLSearchParams(data as any).toString());
    }

    httpRequest.end();
  });
};
