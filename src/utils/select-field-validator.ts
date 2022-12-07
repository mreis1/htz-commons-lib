export interface ListOption<T = any> {
     label: string;
     id: T;
     requires?: any[]; // List of ids that are selected when this option is selected too.
     [key: string]: any;
}

export interface IValidatorOpts<T> {
     newModelValue: T; // any[]
     oldModelValue: T; // any[]
     listOptions: ListOption[];
     /**
      * When dealing with models, whose value is an object and not a string/number
      */
     property?: any;
}

export class SelectFieldOption {
     wasSelected: boolean = false;
     isSelected: boolean = false;
     option: ListOption = {} as any;
     get didChange() {
       return (this.wasSelected && !this.isSelected) // Not longer selected
         || (!this.wasSelected && this.isSelected) // Now selected
     }

     // didChange: boolean;
     constructor() {}
}

export class SelectFieldValidator<T extends any[] = any> {
     private fieldOptions: SelectFieldOption[] = [];
     private newModelValue: any[];
     private oldModelValue: any[];
     private property: any;

     constructor(private options: IValidatorOpts<T>) {
          this.newModelValue = options.newModelValue;
          this.oldModelValue = options.oldModelValue;
          this.property = options.property;
          // Loop on each option
          this.fieldOptions = options.listOptions.map((item) => {
               const sfo = new SelectFieldOption();
               sfo.option = item;
               if (this.property) {
                    sfo.wasSelected = !!this.oldModelValue?.find(
                         (nv) => nv[this.property] === item.id
                    );
                    sfo.isSelected = !!this.newModelValue?.find(
                         (nv) => nv[this.property] === item.id
                    );
               } else {
                    sfo.wasSelected = !!this.oldModelValue?.find(
                         (nv) => nv === item.id
                    );
                    sfo.isSelected = !!this.newModelValue?.find(
                         (nv) => nv === item.id
                    );
               }

               return sfo;
          });

          // console.log('this.fieldOptions', this.fieldOptions);
     }

     get() {
          // Find the property that was changed
          const changedOpt = this.fieldOptions.find(i => i.didChange);
          // Process item that was changed
          this.processItem(changedOpt);

          // Now, find options that require the option above.
          // If above option is now selected, we need to make sure that we verify that all options are selected too.
          // If above option was de-selected,
          // Re-evaluate properties in which this field is required.
          const optionsRequiringAboveProp = this.fieldOptions.filter(i => i.option?.requires?.indexOf(changedOpt.option.id) >= 0);
          if (optionsRequiringAboveProp.length) {
               if (changedOpt.isSelected) {
                    optionsRequiringAboveProp.forEach(item => {
                         if (!item.isSelected) {
                              let totalMatches = 0;
                              let rLen = item.option.requires.length;
                              if (this.property) {
                                   item.option.requires.forEach(rId => {
                                        if (this.newModelValue.find(i => i.id === rId)) {
                                             totalMatches++;
                                        }
                                   })
                                   if (totalMatches === rLen) {
                                        this.newModelValue.push(item.option)
                                   }
                              } else {
                                   item.option.requires.forEach(rId => {
                                        this.options.listOptions.find(i => i === rId);
                                   });
                                   if (totalMatches === rLen) {
                                        this.newModelValue.push(item.option.id);
                                   }
                              }
                         }
                    })
               } else {
                    //
               }
          }
          return [...this.newModelValue];
     }

     /**
      * @param item
      */
     processItem(item: SelectFieldOption) {
          let rLen = item.option.requires?.length ?? 0; // Number of required properties in this field.
          if (!item.wasSelected && item.isSelected) {
               if (rLen > 0) {
                    if (this.property) {
                         // Mark required properties as selected
                         item.option.requires.forEach((rValue) => {
                              if (
                                this.newModelValue.find(
                                  (v) => v[this.property] === rValue
                                ) === void 0
                              ) {
                                   const opt = this.fieldOptions.find(
                                     (i) => i.option.id === rValue
                                   )?.option;
                                   if (opt === void 0) {
                                        console.log(
                                          'rValue = ' +
                                          rValue +
                                          ' not found in option list'
                                        );
                                   } else {
                                        this.newModelValue.push(opt);
                                   }
                              }
                         });
                    } else {
                         // Mark required properties as selected
                         item.option.requires.forEach((rValue) => {
                              if (
                                this.newModelValue.indexOf(rValue) ===
                                -1
                              ) {
                                   this.newModelValue.push(rValue);
                              }
                         });
                    }
               }
          } else if (item.wasSelected && item.isSelected) {
               // When this happens it means that something else has changed.
               // and one of the items that this option requires in order to be selected might no longer
               // be selected making this option also non-selected.
               // For that reason, we loop on each property to see if all options required are still selected
               if (rLen > 0) {
                    if (this.property) {
                         let allFound = true;
                         for (let i = 0; i < rLen; i++) {
                              const o = i;
                              if (
                                this.newModelValue.find(
                                  (v) =>
                                    v[this.property] ===
                                    item.option.requires![o]
                                ) === void 0
                              ) {
                                   allFound = false;
                              }
                         }
                         if (!allFound) {
                              // unselect this option
                              const matchIdx = this.newModelValue.findIndex(
                                (v) =>
                                  v[this.property] ===
                                  item.option.id
                              );
                              this.newModelValue.splice(matchIdx, 1);
                         }
                    } else {
                         // const totalMatches = this.newModelValue.find(v => item.option.requires.find(v2 => v2 === v))
                         let allFound = true;
                         for (let i = 0; i < rLen; i++) {
                              const o = i;
                              if (
                                this.newModelValue.find(
                                  (v) =>
                                    v ===
                                    item.option.requires![o]
                                ) === void 0
                              ) {
                                   allFound = false;
                              }
                         }
                         if (!allFound) {
                              // unselect this option
                              const matchIdx = this.newModelValue.findIndex(
                                (v) => v === item.option.id
                              );
                              this.newModelValue.splice(matchIdx, 1);
                         }
                    }
               }
          } else if (rLen > 0) {
               // Check if all options are selected and mark the item as selected
               if (this.property) {
                    let len = item.option.requires.length;
                    let allFound = true;
                    if (len) {
                         for (let i = 0; i < len; i++) {
                              const o = i;
                              if (
                                this.newModelValue.find(
                                  (v) =>
                                    v[this.property] ===
                                    item.option.requires![o]
                                ) === void 0
                              ) {
                                   allFound = false;
                              }
                         }
                    }

                    if (allFound) {
                         this.newModelValue.push(item.option);
                    }
               } else {
                    let len = item.option.requires.length;
                    let allFound = true;
                    if (len) {
                         for (let i = 0; i < len; i++) {
                              const o = i;
                              if (
                                this.newModelValue.find(
                                  (v) =>
                                    v === item.option.requires![o]
                                ) === void 0
                              ) {
                                   allFound = false;
                              }
                         }
                    }

                    if (allFound) {
                         this.newModelValue.push(item.option.id);
                    }
               }
          }
     }
}
