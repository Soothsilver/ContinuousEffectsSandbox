import {assert, expect} from "chai";
import {joinAnyList, joinList} from "../src/Utilities";


describe('Hello', ()=>{
   describe('world', () => {
       it('should just work', () =>{
           expect(2).to.equal(2);
       });
       it ('should not be equal', () =>{
          expect(2).not.to.equal(4);
       });
       it ('should join correctly', () =>{
           expect(joinList(["red", "blue"]))
               .to.equal('red and blue');
       });

       it ('should join correctly 2', () =>{
           expect(joinList(["red", "green", "blue"]))
               .to.equal('red, green and blue');
       });
   })
});