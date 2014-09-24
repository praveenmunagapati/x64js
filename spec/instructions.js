var assert = require('chai').assert;
var x64 = require('../main');
var cpu;

describe('instructions:', function() {

  beforeEach(function() {
    cpu = x64.aBlankCpu();
  });

  describe('add', function() {
    it('adds src to dest by replacing dest', function() {
      cpu = x64.executeInstruction(cpu, 'mov rax, 7');
      cpu = x64.executeInstruction(cpu, 'mov rbx, 3');
      cpu = x64.executeInstruction(cpu, 'add rax, rbx');
      assert.equal(cpu.registers.rax, 10);
      assert.equal(cpu.registers.rbx, 3);
    });
  });

  describe('call', function() {
    /// TODO: Fix repeated test
    it('pushes the return address on the stack and jumps to a label', function() {
      cpu = x64.loadProgramIntoMemory(x64.aBlankCpu(), [
        'iamcool:',
        '  mov rax 582',
        '  ret',
        '_start:',
        '  mov rax 426',
        '  call iamcool'
      ]);
      cpu = x64.executeProgram(cpu);
      assert.equal(cpu.registers.rax, 582);
    });
  });

  describe('cld', function() {
    it('sets the direction flag to 0', function() {
      cpu = x64.loadProgramIntoMemory(x64.aBlankCpu(), [
        '_start:',
        '  cld',
      ]);
      cpu.registers.flags.DF = true;
      cpu = x64.executeProgram(cpu);
      assert.equal(cpu.registers.flags.DF, false);
    });
  });

  describe('jmp', function() {
    /// TODO: This doesn't actually test jmp
    it('jumps to a label', function() {
      cpu = x64.loadProgramIntoMemory(x64.aBlankCpu(), [
        'iamcool:',
        '  mov rax 582',
        '  ret',
        '_start:',
        '  mov rax 426',
        '  call iamcool'
      ]);
      cpu = x64.executeProgram(cpu);
      assert.equal(cpu.registers.rax, 582);
    });
  });

  describe('jz', function() {
    it('jumps if ZF is true', function() {
      cpu = x64.aBlankCpu();
      cpu.registers.flags.ZF = true;
      cpu = x64.loadProgramIntoMemory(cpu, [
        'finn:',
        '  mov rbx 582',
        '  jmp _end',
        '_start:',
        '  jz finn',
        '_end:',
        '  mov rcx 629'
      ]);
      cpu = x64.executeProgram(cpu);
      assert.equal(cpu.registers.rbx, 582);
      assert.equal(cpu.registers.rcx, 629);
    });
    it('does not jump if ZF is false', function() {
      cpu = x64.aBlankCpu();
      cpu.registers.flags.ZF = false;
      cpu = x64.loadProgramIntoMemory(cpu, [
        'finn:',
        '  mov rbx 582',
        '  jmp _end',
        '_start:',
        '  jz finn',
        '_end:',
        '  mov rcx 629'
      ]);
      cpu = x64.executeProgram(cpu);
      assert.equal(cpu.registers.rbx, 0);
      assert.equal(cpu.registers.rcx, 629);
    });
  });

  describe('mov', function() {
    it('should assign the rax register', function() {
      cpu = x64.executeInstruction(cpu, 'mov rax, 5');
      assert.equal(cpu.registers.rax, 5);
    });
  });

  describe('not', function() {
    it('bitwise nots one register', function() {
      cpu = x64.executeInstruction(cpu, 'mov rax, 7');
      cpu = x64.executeInstruction(cpu, 'not rax');
      assert.equal(cpu.registers.rax, -8);
    });
  });

  describe('pop', function() {
    it("pops a register's pointer and puts the value in dest", function() {
      cpu = x64.executeInstruction(cpu, 'mov rax, 7');
      cpu = x64.executeInstruction(cpu, 'push rax');
      cpu = x64.executeInstruction(cpu, 'pop rbx');
      assert.deepEqual(cpu.registers.rax, 7);
      assert.deepEqual(cpu.registers.rbx, 7);
    });
  });

  describe('push', function() {
    it('pushes a register pointer onto the stack', function() {
      cpu = x64.executeInstruction(cpu, 'push rax');
      assert.deepEqual(cpu.stack, ['rax']);
    });
  });

  describe('ret', function() {
    /// TODO: Fix repeated test
    it('pops an address off the stack and jumps to it', function() {
      cpu = x64.loadProgramIntoMemory(x64.aBlankCpu(), [
        'iamcool:',
        '  mov rax 582',
        '  ret',
        '_start:',
        '  mov rax 426',
        '  call iamcool'
      ]);
      cpu = x64.executeProgram(cpu);
      assert.equal(cpu.registers.rax, 582);
    });
  });

  describe('test', function() {
    it('logically ANDs the two operands and sets ZF and SF', function() {
      cpu = x64.loadProgramIntoMemory(x64.aBlankCpu(), [
        '_start:',
        '  mov rax 5',
        '  test rax rax'
      ]);
      cpu = x64.executeProgram(cpu);
      assert.equal(cpu.registers.flags.SF, true);//(number < 0)
      assert.equal(cpu.registers.flags.ZF, false);
    });
    it ('sets PF');
  });

  describe('xor', function() {
    it('applies bitwise xor to src and dest and puts the value in src', function() {
      cpu = x64.readString(cpu, [
        'mov rax 1234',
        'mov rbx 5678',
        'xor rax rbx'
      ]);
      assert.equal(cpu.registers.rax, 4860);
    });
  });

  // Future instructions to implement
  it('int');
  it('lea');
  it('repne');

});
