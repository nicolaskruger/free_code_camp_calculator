const { getLastOper, addDot, addOper, validExprexion, result } = require(".")

describe('deve validar as operações da calculadore',()=>{
    it('deve retornar ultimo operador',()=>{
        expect(getLastOper("123+-3.5"))
            .toBe("-3.5");

    })
    it('deve colocar o ponto corretament',() => {
        expect(addDot(""))
            .toBe('0.')
        expect(addDot('3+4'))
            .toBe('3+4.')
        expect(addDot('3+'))
            .toBe('3+0.')
        expect(addDot('3+7.0'))
            .toBe('3+7.0')
    })
    it('deve adicionar o operador corretamente',() => {
        expect(addOper("","+"))
            .toBe("")
        expect(addOper("4","+"))
            .toBe("4+")
        expect(addOper("4--","+"))
            .toBe("4+")
        expect(addOper("4*","-"))
            .toBe("4*-")
        expect(addOper("4*-","-"))
            .toBe("4*-")
    })
    it('deve retoranr somente a parte da expreçao que for valida',() => {
        expect(validExprexion("-43.4+32--"))
            .toBe("-43.4+32")
    })
    it('deve retornar o resultado corretemente após a operação',()=>{
        expect(result("3+2"))
            .toBe("5")
        expect(result("-3*-3"))
            .toBe("9")
    })
})