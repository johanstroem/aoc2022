import { combineRanges } from "./index";
import { printMap } from "../utils";

describe("index", () => {
  describe("combineRanges", () => {
    it('should combine overlapping ranges', () => {

        let ranges: any = [[1, 2], [1, 5], [1, 10]]
        
        const res = combineRanges(ranges)
        expect(res).toEqual([[1, 10]])
    })

    it('should combine connected ranges', () => {

        let ranges: any = [[1, 2], [2, 5], [5, 10]]
        
        const res = combineRanges(ranges)
        expect(res).toEqual([[1, 10]])
    })

    it('should combine overlapping unsorted ranges', () => {
        let ranges: any = [ [2, 5], [1, 2], [1, 10]]
        
        const res = combineRanges(ranges)
        expect(res).toEqual([[1, 10]])
    })

    it('should combine overlapping unsorted ranges with negative values', () => {
        let ranges: any = [ [2, 5], [-10, 2], [1, 10]]
        
        const res = combineRanges(ranges)
        expect(res).toEqual([[-10, 10]])
    })

    it('should not combine non-overlapping ranges', () => {
        let ranges: any = [ [2, 5], [6, 10]]
        
        const res = combineRanges(ranges)
        expect(res).toEqual([ [2, 5], [6, 10]])
    })

    it('should not combine non-overlapping ranges', () => {
        let ranges: any = [ [2, 5], [4,5], [6, 10]]
        
        const res = combineRanges(ranges)
        expect(res).toEqual([ [2, 5], [6, 10]])
    })

  });
});
