/* tslint:disable */
/* eslint-disable */
/**
 * Momocraft Api
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 *
 * @export
 * @interface UserFriendRequestDto
 */
export interface UserFriendRequestDto {
  /**
   *
   * @type {string}
   * @memberof UserFriendRequestDto
   */
  targetUserOrEmail: string;
  /**
   *
   * @type {string}
   * @memberof UserFriendRequestDto
   */
  comment: string;
  /**
   *
   * @type {string}
   * @memberof UserFriendRequestDto
   */
  requestMessage: string;
}

export function UserFriendRequestDtoFromJSON(json: any): UserFriendRequestDto {
  return UserFriendRequestDtoFromJSONTyped(json, false);
}

export function UserFriendRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserFriendRequestDto {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    targetUserOrEmail: json['targetUserOrEmail'],
    comment: json['comment'],
    requestMessage: json['requestMessage'],
  };
}

export function UserFriendRequestDtoToJSON(value?: UserFriendRequestDto | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    targetUserOrEmail: value.targetUserOrEmail,
    comment: value.comment,
    requestMessage: value.requestMessage,
  };
}
