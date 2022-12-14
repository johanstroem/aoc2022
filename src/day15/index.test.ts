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


    it('should combine connected/adjacent ranges', () => {

        let ranges: any = [[1, 3], [ 10, 14], [4,12], [ -2, 2], [14,26]]
        
        const res = combineRanges(ranges)
        expect(res).toEqual([[-2, 26]])
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
        let ranges: any = [ [2, 5], [7, 10]]
        
        const res = combineRanges(ranges)
        expect(res).toEqual([ [2, 5], [7, 10]])
    })

    it('should not combine non-overlapping ranges', () => {
        let ranges: any = [ [2, 5], [4,5], [7, 10]]
        
        const res = combineRanges(ranges)
        expect(res).toEqual([ [2, 5], [7, 10]])
    })

  });
});
