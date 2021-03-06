import { ResourcePath } from './resource-path';
import { ResourcePathPattern } from './resource-path-pattern';

export function splitResourcePath(pathPattern: string): string[] {
  if (!pathPattern.startsWith('/')) {
    throw new TypeError('Should start with / ' + pathPattern);
  }

  return pathPattern.split('/');
}

export function pathSegmentMatches(
  patternSegment: string,
  pathSegment: string,
): boolean {
  return isPlaceholder(patternSegment) || patternSegment === pathSegment;
}

export function isPlaceholder(patternSegment: string): boolean {
  return patternSegment.startsWith('{');
}

export function placeholderName(name: string): string {
  return name.substring(1, name.length - 1);
}

export function resourceMatches(
  messageResource: string,
  methodPath: string,
): boolean {
  const rp = new ResourcePath(messageResource);
  const rpp = new ResourcePathPattern(methodPath);
  return rpp.isSatisfiedBy(rp);
}

export function getPlaceholderValue(
  pathParams: Record<string, string>[],
  idx: number,
): string | null {
  return idx < pathParams.length ? pathParams[idx].toString() : null;
}
