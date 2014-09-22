var x64 = {};

x64.aBlankCpu = function() {
  return {
    registers: {
      rax: 0,
      rbx: 0,
      rcx: 0,
      rdx: 0
    },
    stack: []
  };
};

x64.programFromArray = function(instructions) {
  var program = {
    instructions: instructions,
    sections: []
  };

  // Create sections with their respective instructions
  var currentSection;
  instructions.forEach(function(instruction) {
    if (isALabel(instruction)) {
      currentSection = instruction.replace(' ', '').replace(':', '');
    }
    else {
      if (currentSection) {
        if (!(currentSection in program.sections)) {
          program.sections[currentSection] = {
            instructions: []
          };
        }
        program.sections[currentSection].instructions.push(instruction);
      }
    }
  });

  return program;
};

x64.executeInstruction = function(cpu, instruction) {
  var opCode = instruction.split(' ').shift();
  var args = getArguments(instruction);
  if (isValidInstruction(opCode)) {
    cpu = instructions[opCode](cpu, args);
  }
  return cpu;
};

// Reads an asm program string
x64.readString = function(cpu, program) {
  if (program instanceof Array) {
    program = program.join('\n');
  }
  if (typeof program !== 'string') {
    throw new Error('program was not a string');
  }
  return program.split('\n').reduce(x64.executeInstruction, cpu);
};

var instructions = {
  add: function(cpu, args) {
    var dest = args[0];
    var src = args[1];
    cpu.registers[dest] = cpu.registers[dest] + cpu.registers[src];
    return cpu;
  },
  mov: function(cpu, args) {
    var register = args[0];
    cpu.registers[register] = Number(args[1]);
    return cpu;
  },
  not: function(cpu, args) {
    var src = args[0];
    var value = Number(cpu.registers[src]);
    cpu.registers[src] = ~value;
    return cpu;
  },
  pop: function(cpu, args) {
    var dest = args[0];
    var register = cpu.stack.pop();
    cpu.registers[dest] = cpu.registers[register];
    return cpu;
  },
  push: function(cpu, args) {
    cpu.stack.push(args[0]);
    return cpu;
  },
  xor: function(cpu, args) {
    var src = args[0];
    var dest = args[1];
    cpu.registers[src] = cpu.registers[src] ^ cpu.registers[dest];
    return cpu;
  }
};

var isValidInstruction = function(instruction) {
  // TODO: Make sure memory access is secure
  return instruction in instructions;
};

var isValidRegister = function(register) {
  return register in registers;
};

var isALabel = function(instruction) {
  // Naive
  return instruction.indexOf(':') !== -1;
};

var getArguments = function(str) {
  // TODO: instructions are assumed to have a space after the comma
  return str.replace(',', '')
            .split(' ')
            .slice(1);
};

module.exports = x64;
