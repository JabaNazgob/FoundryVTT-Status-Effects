import { Constants as C, updateEffect, createEffect } from "./const.js";

/*
// Дым - увеличение области крита от стаков
// workflow.attackRoll.options.critical
Hooks.on(dnd5e.rollAttack, (item, roll) => {
    const smokeEffect = item.actor?.appliedEffects?.find(eff => /Дым - [0-9]+$/.test(eff?.name));
    if (smokeEffect) {
        foundry.utils.setProperty(roll, "options.critical", (roll.options.critical || 20) - (parseInt(smokeEffect.name.match(/Дым - ([0-9]+)/)[1]) || 0));
    }
})
*/

// Паралич - уменьшение кол-ва стаков после атаки
Hooks.on("midi-qol.AttackRollComplete", async (workflow) => {
    const effect = workflow.actor?.appliedEffects?.find(eff => /Паралич - [0-9]+$/.test(eff.name))
    if (effect) {
        const effectStacks = Math.floor(parseInt(effect.label.match(/\d+/)[0]) / 2)
        if (effectStacks > 0) {
            await updateEffect(effect, paralysisUpdates("Паралич", effectStacks))
            new Sequence()
                .scrollingText(workflow.token, `Паралич - ${effectStacks}`)   
                .play() 
        } else {
            await effect.delete()
        }
    }
})
const paralysisUpdates = (effectName, effectStacks) => {return {
    'label': `${effectName} - ${effectStacks}`,
    'changes': [
        {
            'key': 'system.bonuses.All-Attacks',
            'mode': 2,
            'value': -effectStacks,
            'priority': 20
        }
    ],
}}